import { Request, Response } from 'express';
import mongoose from 'mongoose';

import PostModel from '../models/Post';
import { authorize, protect } from '../utils/auth';
import { returnError } from '../utils/returnError';
import { get, post, del, controller, patch, use } from './decorators';
import { validateCreateDraft, validateCreatePost } from '../utils/validation/posts';
import { sendServerResponse } from '../utils/sendServerResponse';
import { getFileNameExtension } from '../utils/getFileNameExtenstion';
import { uploadFile } from '../utils/googleCloudStorage';
import { PostStatus, Role } from '../utils/constants';

@controller('/posts')
export class PostsController {
    @use(protect)
    @post('/')
    async createPost(req: Request, res: Response) {
        try {
            const { errors, isValid } = validateCreatePost(req.body);
            const file = req.files?.image;
            if (!file) {
                errors.mediaUrl = 'Post image is required!';
            }
            if (!isValid || Object.keys(errors).length > 0) {
                return sendServerResponse(res, { 
                    statusCode: 400, 
                    success: false, 
                    errors,
                    msg: 'Invalid post data!',
                });
            }


            const fileNameExtension = getFileNameExtension(file.name);
            const uploadResponse = await uploadFile(file.tempFilePath, `posts/${new mongoose.Types.ObjectId()}.${fileNameExtension}`);

            const post = await PostModel.create({ ...req.body, author: req.user._id, status: PostStatus.PUBLISHED, mediaName: uploadResponse.name, mediaUrl: uploadResponse.url });

            return sendServerResponse(res, {
                statusCode: 201, 
                success: true, 
                data: post,
                msg: 'Your blog has been submitted and will reviewed and approved shortly by an admin'
            });
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

                const post = await PostModel.create({ ...req.body, author: req.user._id, status: PostStatus.DRAFT, mediaName: uploadResponse.name, mediaUrl: uploadResponse.url });

                return sendServerResponse(res, {
                    statusCode: 201, 
                    success: true, 
                    data: post,
                    msg: 'Your blog has been saved succcessfully. You can always come back and continue writing.'
                });
            }

            const post = await PostModel.create({ ...req.body, author: req.user._id, status: PostStatus.DRAFT });

            return sendServerResponse(res, {
                statusCode: 201, 
                success: true, 
                data: post,
                msg: 'Your blog has been saved succcessfully. You can always come back and continue writing.'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to save post');
        }
    }

    @get('/:id')
    async getPost(req: Request, res: Response) {
        try {
            const post = await PostModel.findOne({ slug: req.params.id });
            if (!post) {
                return sendServerResponse(res, {
                    success: false,
                    statusCode: 404,
                    errors: { msg: 'Post does not exist' }
                });
            }
            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: post
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to get post');
        }
    }

    @get('/categories/category/:categoryId')
    async getPostsByCategory(req: Request, res: Response) {
        try {
            const posts = await PostModel.find({ category: req.params.categoryId, status: PostStatus.APPROVED })
                .populate({ path: 'author', select: 'name avatar' })
                .populate({ path: 'category', select: 'name' })
                .sort({ createdAt: 'desc' })
                .exec();

            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: posts,
                count: posts.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to get posts by category');
        }
    }

    @get('/:id/:slug')
    async getPostBySlug(req: Request, res: Response) {
        try {
            const post = await PostModel.findOne({ _id: req.params.id, slug: req.params.slug.toLowerCase(), status: PostStatus.APPROVED })
                .populate({ path: 'author', select: 'name avatar' })
                .populate({ path: 'category', select: 'name' })
                .exec();

            if (!post) {
                return sendServerResponse(res, {
                    success: false,
                    statusCode: 404,
                    errors: { msg: 'Post does not exist' }
                });
            }
            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: post
            });
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

    @use(authorize(Role.ADMIN))
    @use(protect)
    @patch('/acceptPost/:postId')
    async approvePost(req: Request, res: Response) {
        try {
            const acceptedPost = await PostModel.updateOne({ _id: req.params.postId }, { $set: { status: PostStatus.APPROVED, approvedAt: new Date(), approvedBy: req.user._id } }, { new: true });

            // Send email approval post with link to post in email

            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: acceptedPost,
                msg: 'Post approved successfully'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to approve post');
        }
    }
    
    @use(authorize(Role.ADMIN))
    @use(protect)
    @patch('/rejectPost/:postId')
    async rejectPost(req: Request, res: Response) {
        try {
            const acceptedPost = await PostModel.updateOne({ _id: req.params.postId }, { $set: { status: PostStatus.REJECTED, rejectedAt: new Date(), rejectedBy: req.user._id } }, { new: true });

            // Send post rejection email

            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: acceptedPost,
                msg: 'Post rejected successfully'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to reject post');
        }
    }

    @use(protect)
    @del('/:id')
    async deletePost(req: Request, res: Response) {
        try {
            const post = await PostModel.findById(req.params.id);

            if (!post) {
                return sendServerResponse(res, {
                    success: false,
                    statusCode: 404,
                    errors: { msg: 'Post does not exist' }
                });
            }

            // Check if author owns post or it user is admin before deleting
            // if (req.user._id.equals(req.params.id)) {

            // }
            await PostModel.findOneAndDelete({ _id: req.params.id });

            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                msg: 'Post deleted successfully'
            });

        } catch (err) {
            return returnError(err, res, 500, 'Failed to delete post');
        }
    }
}