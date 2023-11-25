import { Request, Response } from 'express';
import mongoose from 'mongoose';

import PostModel from '../models/Post';
import { protect } from '../utils/auth';
import { returnError } from '../utils/returnError';
import { get, post, del, controller, patch, use } from './decorators';
import { validateCreateDraft } from '../utils/validation/posts';
import { sendServerResponse } from '../utils/sendServerResponse';
import { getFileNameExtension } from '../utils/getFileNameExtenstion';
import { uploadFile } from '../utils/googleCloudStorage';
import { PostStatus } from '../utils/constants';

@controller('/posts')
export class PostsController {
    @use(protect)
    @post('/')
    async createPost(req: Request, res: Response) {
        try {
            console.log(req.body);
        } catch (err) {
            return returnError(err, res, 500, 'Failed to create post');
        }
    }

    @use(protect)
    @post('/drafts')
    async createDraft(req: Request, res: Response) {
        try {
            const { errors, isValid } = validateCreateDraft(req.body);

            if (!isValid) {
                return sendServerResponse(res, { 
                    statusCode: 400, 
                    success: false, 
                    errors,
                    msg: 'Invalid post data!',
                });
            }

            const file = req.files?.image;

            if (file) {
                const fileNameExtension = getFileNameExtension(file.name);
                const uploadResponse = await uploadFile(file.tempFilePath, `posts/${new mongoose.Types.ObjectId()}.${fileNameExtension}`);

                const post = await PostModel.create({ ...req.body, author: req.user._id, status: PostStatus.DRAFT, mediaName: uploadResponse.name, mediaUrl: uploadResponse.url, category: '655e98cff0a023f744d6be21' });

                return sendServerResponse(res, {
                    statusCode: 201, 
                    success: true, 
                    data: post,
                    msg: 'Post saved successfully'
                });
            }

            const post = await PostModel.create({ ...req.body, author: req.user._id, status: PostStatus.DRAFT, category: '655e98cff0a023f744d6be21' });

            return sendServerResponse(res, {
                statusCode: 201, 
                success: true, 
                data: post,
                msg: 'Post saved successfully'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to save post');
        }
    }

    @post('/:id')
    async getPost(_req: Request, res: Response) {
        try {

        } catch (err) {
            return returnError(err, res, 500, 'Failed to get post');
        }
    }

    @use(protect)
    @patch('/')
    async updatePost(_req: Request, res: Response) {
        try {

        } catch (err) {
            return returnError(err, res, 500, 'Failed to update post');
        }
    }

    @get('/category/:categoryId')
    async getPostsByCategory(_req: Request, res: Response) {
        try {

        } catch (err) {
            return returnError(err, res, 500, 'Failed to get posts');
        }
    }

    @patch('/rejectPost/:postId')
    async rejectPost(_req: Request, res: Response) {
        try {

        } catch (err) {
            return returnError(err, res, 500, 'Failed to get posts');
        }
    }

    @use(protect)
    @del('/')
    async deletePost(_req: Request, res: Response) {
        try {

        } catch (err) {
            return returnError(err, res, 500, 'Failed to delete post');
        }
    }
}