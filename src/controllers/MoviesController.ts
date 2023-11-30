
import { Request, Response } from 'express';

import { authorize, protect } from '../utils/auth';
import { returnError } from '../utils/returnError';
import { post, controller, use } from './decorators';

import MovieModel from '../models/Movie';
import { sendServerResponse } from '../utils/sendServerResponse';
import { Role } from '../utils/constants';
import { validateAddMovie } from '../utils/validation/movies/add';
import { uploadFile } from '../utils/googleCloudStorage';
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
            const { url, name } = await uploadFile(file.tempFilePath, `movies/${generateSlug(req.body.title)}.${fileNameExtension}`);
            const movie = await MovieModel.create({ ...req.body, thumbnailName: name, thumbnailUrl: url });

            return sendServerResponse(res, {
                statusCode: 201,
                success: true,
                msg: 'Movie added successfully',
                data: movie
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to add movie');
        }
    }
}