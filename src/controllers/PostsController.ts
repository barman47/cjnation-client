import { Request, Response } from 'express';
import mongoose from 'mongoose';

import PostModel from '../models/Post';
import { authorize, protect } from '../utils/auth';
import { returnError } from '../utils/returnError';
import { get, post, del, controller, patch, use, put } from './decorators';
import { validateCreateDraft, validateCreatePost } from '../utils/validation/posts';
import { sendServerResponse } from '../utils/sendServerResponse';
import { getFileNameExtension } from '../utils/getFileNameExtenstion';
import { deleteFile, uploadFile } from '../utils/googleCloudStorage';
import { PostStatus, Role } from '../utils/constants';
import { generateReadDuration } from '../utils/generateReadDuration';
import { generateSlug } from '../utils/generateSlug';
import { isEmpty } from '../utils/isEmpty';

@controller('/posts')
export class PostsController {

    @get('/')
    async getPostIds(_req: Request, res: Response) {
        try {
            const posts = await PostModel.find();
            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: posts,
                count: posts.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to get posts');
        }
    }
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

    @use(protect)
    @patch('/drafts/save/:id')
    async saveDraft(req: Request, res: Response) {
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
                const post = await PostModel.findOne({ _id: req.params.id, status: PostStatus.DRAFT });

                if (!post) {
                    return sendServerResponse(res, { 
                        statusCode: 404, 
                        success: false, 
                        errors: {  },
                        msg: 'Post does not exist'
                    });   
                }

                if (post.mediaName) {
                    await deleteFile(post.mediaName);
                }

                const fileNameExtension = getFileNameExtension(file.name);
                const uploadResponse = await uploadFile(file.tempFilePath, `posts/${new mongoose.Types.ObjectId()}.${fileNameExtension}`);

                const updatedDraft = await PostModel.findOneAndUpdate({ _id: req.params.id, status: PostStatus.DRAFT },{ $set: {...req.body, readDuration: generateReadDuration(req.body.body), slug: generateSlug(req.body.title), mediaName: uploadResponse.name, mediaUrl: uploadResponse.url} }, { new: true })
                    .populate({ path: 'category', select: 'name' })
                    .exec();

                return sendServerResponse(res, {
                    statusCode: 200, 
                    success: true, 
                    data: updatedDraft,
                    msg: 'Your blog has been saved succcessfully. You can always come back and continue writing.'
                });
            }

            const updatedDraft = await PostModel.findOneAndUpdate({ _id: req.params.id, status: PostStatus.DRAFT },{ $set: {...req.body, readDuration: generateReadDuration(req.body.body), slug: generateSlug(req.body.title), } }, { new: true })
                    .populate({ path: 'category', select: 'name' })
                    .exec();

            return sendServerResponse(res, {
                statusCode: 200, 
                success: true, 
                data: updatedDraft,
                msg: 'Your blog has been saved succcessfully. You can always come back and continue writing.'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to save post');
        }
    }

    @use(protect)
    @get('/:id')
    async getPost(req: Request, res: Response) {
        try {
            const post = await PostModel.findById(req.params.id).populate({ path: 'category', select: 'name' }).exec();
            if (!post) {
                return sendServerResponse(res, {
                    success: false,
                    statusCode: 404,
                    errors: {  },
                    msg: 'Post does not exist'
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

    @get('/featured/posts')
    async getFeaturedPosts(_req: Request, res: Response) {
        try {
            const posts = await PostModel.find({ status: PostStatus.APPROVED })
                .populate({ path: 'author', select: 'name' })
                .populate({ path: 'category', select: 'name' })
                .sort({ createdAt: 'desc' })
                .limit(5)
                .exec();
            
            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: posts,
                count: posts.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to get featured posts');
        }
    }

    @use(authorize(Role.ADMIN))
    @use(protect)
    @get('/pending/posts')
    async getPendingPosts(_req: Request, res: Response) {
        try {
            const posts = await PostModel.find({ status: PostStatus.PUBLISHED })
                .populate({ path: 'category', select: 'name' })
                .populate({ path: 'author', select: 'name avatar' })
                .sort({ createdAt: 'desc' })
                .exec();
            
            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: posts,
                count: posts.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to get pending posts');
        }
    }

    @use(protect)
    @get('/user/posts')
    async getPostsForUser (req: Request, res: Response) {
        try {
            const posts = await PostModel.find({ author: req.user._id }).populate({ path: 'category', select: 'name' }).sort({ createdAt: 'desc' }).exec();
            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: posts,
                count: posts.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to get posts for user');
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
                    errors: {  },
                    msg: 'Post does not exist'
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
    @put('/:id')
    async updatePost(req: Request, res: Response) {
        try {
            const { errors, isValid } = validateCreatePost(req.body);

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
                const post = await PostModel.findOne({ _id: req.params.id });

                if (!post) {
                    return sendServerResponse(res, { 
                        statusCode: 404, 
                        success: false, 
                        errors: {  },
                        msg: 'Post does not exist'
                    });   
                }

                if (post.mediaName) {
                    await deleteFile(post.mediaName);
                }

                const fileNameExtension = getFileNameExtension(file.name);
                const uploadResponse = await uploadFile(file.tempFilePath, `posts/${new mongoose.Types.ObjectId()}.${fileNameExtension}`);

                const updatedPost = await PostModel.findOneAndUpdate({ _id: req.params.id },{ $set: {...req.body, readDuration: generateReadDuration(req.body.body), slug: generateSlug(req.body.title), mediaName: uploadResponse.name, mediaUrl: uploadResponse.url} }, { new: true })
                    .populate({ path: 'category', select: 'name' })
                    .exec();

                return sendServerResponse(res, {
                    statusCode: 200, 
                    success: true, 
                    data: updatedPost,
                    msg: 'Your blog has been submitted and will reviewed and approved shortly by an admin'
                });
            }

            const updatedDraft = await PostModel.findOneAndUpdate({ _id: req.params.id },{ $set: {...req.body, readDuration: generateReadDuration(req.body.body), slug: generateSlug(req.body.title), } }, { new: true })
                    .populate({ path: 'category', select: 'name' })
                    .exec();

            return sendServerResponse(res, {
                statusCode: 200, 
                success: true, 
                data: updatedDraft,
                msg: 'Your blog has been submitted and will reviewed and approved shortly by an admin'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to publish post');
        }
    }

    @use(authorize(Role.ADMIN))
    @use(protect)
    @patch('/approvePost/:postId')
    async approvePost(req: Request, res: Response) {
        try {
            const acceptedPost = await PostModel.findOneAndUpdate({ _id: req.params.postId }, { $set: { status: PostStatus.APPROVED, approvedAt: new Date(), approvedBy: req.user._id } }, { new: true });

            // TODO Send email approval post with link to post in email

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
            if (isEmpty(req.body.rejectionReason)) {
                return sendServerResponse(res, {
                    success: false,
                    statusCode: 400,
                    errors: { rejectionReason: 'Rejection reason is required!' },
                    msg: 'Invalid rejection data!'
                });
            }
            const acceptedPost = await PostModel.findOneAndUpdate({ _id: req.params.postId }, { $set: { status: PostStatus.REJECTED, rejectionReason: req.body.rejectionReason, rejectedAt: new Date(), rejectedBy: req.user._id } }, { new: true });

            // TODO Send post rejection email

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
    @patch('/publishPost/:postId')
    async publishPost(req: Request, res: Response) {
        try {
            const post = await PostModel.findOne({ _id: req.params.postId });

            if (!post) {
                return sendServerResponse(res, {
                    success: false,
                    statusCode: 404,
                    errors: { },
                    msg: 'Post does not exist'
                });
            }

            if (!post.mediaUrl) {
                return sendServerResponse(res, {
                    success: false,
                    statusCode: 400,
                    errors: {  },
                    msg: 'Image for post is required!'
                });
            }

            const publishedPost = await PostModel.findOneAndUpdate({ _id: req.params.postId }, { $set: { status: PostStatus.PUBLISHED } }, { new: true });

            // TODO Send publication email to admin

            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: publishedPost,
                msg: 'Post published successfully'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to publish post');
        }
    }

    @use(protect)
    @patch('/image/remove/:postId')
    async removePostImage(req: Request, res: Response) {
        try {
            if (!req.body.mediaName) {
                return sendServerResponse(res, {
                    success: false,
                    statusCode: 400,
                    errors: {  },
                    msg: 'Post image name is required!'
                });
            }
            await deleteFile(req.body.mediaName);
            const updatedPost = await PostModel.findOneAndUpdate({ _id: req.params.postId }, { $unset: { mediaName: 1, mediaUrl: 1 } }, { new: true }).populate({ path: 'category', select: 'name' }).exec();

            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: updatedPost
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to delete post image');
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
                    errors: {  },
                    msg: 'Post does not exist'
                });
            }

            // TODO Check if author owns post or it user is admin before deleting
            // if (req.user._id.equals(req.params.id)) {

            // }
            if (post.mediaName) {
                await deleteFile(post.mediaName);
            }
            await PostModel.findOneAndDelete({ _id: req.params.id });

            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                msg: 'Post deleted successfully',
                data: post
            });

        } catch (err) {
            return returnError(err, res, 500, 'Failed to delete post');
        }
    }
}