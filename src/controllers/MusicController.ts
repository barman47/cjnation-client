
import { Request, Response } from 'express';

import { authorize, protect } from '../utils/auth';
import { returnError } from '../utils/returnError';
import { post, controller, use, get, del } from './decorators';

import MusicModel from '../models/Music';
import { sendServerResponse } from '../utils/sendServerResponse';
import { Role } from '../utils/constants';
import { validateAddMusic } from '../utils/validation/music/add';
import { deleteFile, uploadFile } from '../utils/googleCloudStorage';
import { generateSlug } from '../utils/generateSlug';
import { getFileNameExtension } from '../utils/getFileNameExtenstion';

@controller('/music')
export class MusicController {
    @use(authorize(Role.ADMIN))
    @use(protect)
    @post('/')
    async addMusic(req: Request, res: Response) {
        try {
            const musicFile = req.files?.music;
            const imageFile = req.files?.image;

            const { errors, isValid } = validateAddMusic({ ...req.body, mediaName: musicFile ? 'some-text' : '', thumbnailName: imageFile ? 'some-text' : '' });

            if (!isValid) {
                return sendServerResponse(res, {
                    statusCode: 400,
                    success: false,
                    errors,
                    msg: 'Invalid music data!'
                });
            }

            const musicFileNameExtension = getFileNameExtension(musicFile.name);
            const imageFileNameExtension = getFileNameExtension(imageFile.name);

            const [musicUploadResponse, thumbnailUploadResponse ] = await Promise.all([
                uploadFile(musicFile.tempFilePath, `${process.env.MUSIC_FOLDER}/${generateSlug(req.body.title)}.${musicFileNameExtension}`),
                uploadFile(imageFile.tempFilePath, `${process.env.MUSIC_FOLDER}/${process.env.MUSIC_THUMBNAILS_FOLDER}/${generateSlug(req.body.title)}.${imageFileNameExtension}`)
            ]);

            const music = await MusicModel.create({ 
                ...req.body, 
                mediaUrl: musicUploadResponse.url, 
                mediaName: musicUploadResponse.name, 
                thumbnailName: thumbnailUploadResponse.name,
                thumbnailUrl: thumbnailUploadResponse.url
            });
            const populatedMusic = await MusicModel.findById(music._id).populate({ path: 'genre', select: 'name' }).exec();

            return sendServerResponse(res, {
                statusCode: 201,
                success: true,
                msg: 'Music added successfully',
                data: populatedMusic
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to add music');
        }
    }

    @use(protect)
    @get('/')
    async getMusic(_req: Request, res: Response) {
        try {
            const music = await MusicModel.find()
                .populate({ path: 'genre', select: 'name' })
                .sort({ createdAt: 'desc' })
                .exec();

            return sendServerResponse(res, {
                statusCode: 200,
                success: true,
                data: music,
                count: music.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to get music');
        }
    }

    @use(protect)
    @get('/search')
    async searchMusic(req: Request, res: Response) {
        try {
           
            const musics = await MusicModel.find({ $text: { $search: req.query.text?.toString()! } });

            return sendServerResponse(res, {
                statusCode: 200,
                success: true,
                data: musics,
                count: musics.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to find music');
        }
    }

    @use(authorize(Role.ADMIN))
    @use(protect)
    @del('/:id')
    async deleteMusic(req: Request, res: Response) {
        try {
            const music = await MusicModel.findById(req.params.id);

            if (!music) {
                return sendServerResponse(res, {
                    statusCode: 400,
                    success: false,
                    errors: { },
                    msg: 'Music does not exist!'
                });
            }

            await Promise.all([
                deleteFile(music.mediaName!),
                deleteFile(music.thumbnailName!)
            ]);

            await MusicModel.findByIdAndDelete(req.params.id);

            return sendServerResponse(res, {
                statusCode: 200,
                success: true,
                data: music,
                msg: 'Music deleted successfully'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to delete music');
        }
    }
}