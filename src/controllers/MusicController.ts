
import { Request, Response } from 'express';

import { authorize, protect } from '../utils/auth';
import { returnError } from '../utils/returnError';
import { post, controller, use } from './decorators';

import MusicModel from '../models/Music';
import { sendServerResponse } from '../utils/sendServerResponse';
import { Role } from '../utils/constants';
import { validateAddMusic } from '../utils/validation/music/add';
import { uploadFile } from '../utils/googleCloudStorage';
import { generateSlug } from '../utils/generateSlug';
import { getFileNameExtension } from '../utils/getFileNameExtenstion';

@controller('/music')
export class MusicController {
    @use(authorize(Role.ADMIN))
    @use(protect)
    @post('/')
    async addMusic(req: Request, res: Response) {
        try {
            const file = req.files?.music;

            const { errors, isValid } = validateAddMusic({ ...req.body, mediaName: file ? 'some-text' : '' });

            if (!isValid) {
                return sendServerResponse(res, {
                    statusCode: 400,
                    success: false,
                    errors,
                    msg: 'Invalid music data!'
                });
            }

            const fileNameExtension = getFileNameExtension(file.name);
            const { url, name } = await uploadFile(file.tempFilePath, `music/${generateSlug(req.body.title)}.${fileNameExtension}`);
            const movie = await MusicModel.create({ ...req.body, mediaUrl: url, mediaName: name });

            return sendServerResponse(res, {
                statusCode: 201,
                success: true,
                msg: 'Music added successfully',
                data: movie
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to add music');
        }
    }
}