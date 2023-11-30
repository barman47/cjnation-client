
import { Request, Response } from 'express';

import { authorize, protect } from '../utils/auth';
import { returnError } from '../utils/returnError';
import { post, controller, use, get, del, put } from './decorators';

import MovieModel from '../models/Movie';
import { sendServerResponse } from '../utils/sendServerResponse';
import { Role } from '../utils/constants';
import { validateAddMovie, validateEditMovie } from '../utils/validation/movies';
import { deleteFile, uploadFile } from '../utils/googleCloudStorage';
import { generateSlug } from '../utils/generateSlug';
import { getFileNameExtension } from '../utils/getFileNameExtenstion';

@controller('/movies')
export class MovieController {
    @use(authorize(Role.ADMIN))
    @use(protect)
    @post('/')
    async addMovie(req: Request, res: Response) {
        try {
            const file = req.files?.image;

            const { errors, isValid } = validateAddMovie({ ...req.body, thumbnailName: file ? 'some-text' : '' });

            if (!isValid) {
                return sendServerResponse(res, {
                    statusCode: 400,
                    success: false,
                    errors,
                    msg: 'Invalid movie data!'
                });
            }

            const fileNameExtension = getFileNameExtension(file.name);
            const { url, name } = await uploadFile(file.tempFilePath, `${process.env.MOVIES_FOLDER}/${generateSlug(req.body.title)}.${fileNameExtension}`);
            const movie = await MovieModel.create({ ...req.body, thumbnailName: name, thumbnailUrl: url });
            const populatedMovie = await MovieModel.findById(movie._id).populate({ path: 'genre', select: 'name' }).exec();

            return sendServerResponse(res, {
                statusCode: 201,
                success: true,
                msg: 'Movie added successfully',
                data: populatedMovie
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to add movie');
        }
    }

    @use(protect)
    @get('/')
    async getMusic(_req: Request, res: Response) {
        try {
            const movies = await MovieModel.find()
                .populate({ path: 'genre', select: 'name' })
                .sort({ createdAt: 'desc' })
                .exec();

            return sendServerResponse(res, {
                statusCode: 200,
                success: true,
                data: movies,
                count: movies.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to get movies');
        }
    }

    @use(protect)
    @get('/search')
    async searchMovie(req: Request, res: Response) {
        try {
           
            if (!req.query.text?.toString()) {
                const movies = await MovieModel.find()
                    .populate({ path: 'genre', select: 'name' })
                    .sort({ createdAt: 'desc' })
                    .exec();

                return sendServerResponse(res, {
                    statusCode: 200,
                    success: true,
                    data: movies,
                    count: movies.length
                });
            }

            const movies = await MovieModel.find({ $text: { $search: req.query.text?.toString()! } })
                .populate({ path: 'genre', select: 'name' })
                .sort({ createdAt: 'desc' })
                .exec();

            return sendServerResponse(res, {
                statusCode: 200,
                success: true,
                data: movies,
                count: movies.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to find movies');
        }
    }

    @use(authorize(Role.ADMIN))
    @use(protect)
    @put('/:id')
    async editMovie(req: Request, res: Response) {
        try {
            const { errors, isValid } = validateEditMovie(req.body);

            if (!isValid) {
                return sendServerResponse(res, {
                    statusCode: 400,
                    success: false,
                    errors,
                    msg: 'Invalid movie data!'
                });
            }

            const movie = await MovieModel.findById(req.params.id);

            if (!movie) {
                return sendServerResponse(res, {
                    statusCode: 404,
                    success: false,
                    errors,
                    msg: 'Movie does not exist!'
                });
            }   

            const file = req.files?.image;

            if (file) {
                await deleteFile(movie.thumbnailName!);
                const fileNameExtension = getFileNameExtension(file.name);
                const { url, name } = await uploadFile(file.tempFilePath, `${process.env.MOVIES_FOLDER}/${generateSlug(req.body.title)}.${fileNameExtension}`);
                await MovieModel.findByIdAndUpdate(req.params.id, { $set: { ...req.body, thumbnailUrl: url, thumbnailName: name } }, { new: true, runValidators: true });
                const populatedMovie = await MovieModel.findById(req.params.id).populate({ path: 'genre', select: 'name' }).exec();

                return sendServerResponse(res, {
                    statusCode: 200,
                    success: true,
                    msg: 'Movie updated successfully',
                    data: populatedMovie
                });
            }
            
            const updatedMovie = await MovieModel.findByIdAndUpdate(req.params.id, { $set: {...req.body } }, { new: true, runValidators: true })
                .populate({ path: 'genre', select: 'name' })
                .exec();

            return sendServerResponse(res, {
                statusCode: 200,
                success: true,
                msg: 'Movie updated successfully',
                data: updatedMovie
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to update movie');
        }
    }

    @use(authorize(Role.ADMIN))
    @use(protect)
    @del('/:id')
    async deleteMovie(req: Request, res: Response) {
        try {
            const movie = await MovieModel.findById(req.params.id);

            if (!movie) {
                return sendServerResponse(res, {
                    statusCode: 400,
                    success: false,
                    errors: { },
                    msg: 'Movie does not exist!'
                });
            }

            await deleteFile(movie.thumbnailName!)

            await MovieModel.findByIdAndDelete(req.params.id);

            return sendServerResponse(res, {
                statusCode: 200,
                success: true,
                data: movie,
                msg: 'Music deleted successfully'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to delete movie');
        }
    }
}