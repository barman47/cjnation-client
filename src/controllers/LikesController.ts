import { Request, Response } from 'express';

import LikeModel from '../models/Like';
import PostModel from '../models/Post';
import { protect } from '../utils/auth';
import { returnError } from '../utils/returnError';
import { get, post, controller, use, del } from './decorators';
import { sendServerResponse } from '../utils/sendServerResponse';

@controller('/likes')
export class LikesController {
    @use(protect)
    @post('/:postId')
    async addLike(req: Request, res: Response) {
        try {
            const [like] = await Promise.all([
                LikeModel.create({ user: req.user._id, post: req.params.postId }),
                PostModel.updateOne({ _id: req.params.postId }, { $inc: { likes: 1 } })
            ]);

            return sendServerResponse(res, {
                success: true,
                statusCode: 201,
                data: like,
                msg: 'Like added successfully'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to add like to post');
        }
    }

    @use(protect)
    @del('/:postId')
    async removeLike(req: Request, res: Response) {
        try {
            const [deletedLike] = await Promise.all([
                LikeModel.findOneAndDelete({ user: req.user._id }),
                PostModel.updateOne({ _id: req.params.postId }, { $inc: { likes: -1 } })
            ]);
            return sendServerResponse(res, {
                success: true,
                statusCode: 201,
                data: deletedLike,
                msg: 'Like removed successfully'
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to remove like');
        }
    }

    @get('/:postId')
    async getLikesForPost(req: Request, res: Response) {
        try {
            const likes = await LikeModel.find({ post: req.params.postId });
            return sendServerResponse(res, {
                success: true,
                statusCode: 200,
                data: likes,
                count: likes.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to get likes for post');
        }
    }
}