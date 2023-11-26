import { Document, Schema, Types, model } from 'mongoose';

export interface Like extends Document {
    post: Types.ObjectId | string;
    user: Types.ObjectId | string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

const LikeSchema = new Schema<Like>({
    post: {
        type: Schema.Types.ObjectId,
        required: [true, 'Post id is required!']
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required!']
    }
}, { timestamps: true });

// creates a compound index on the Like collection, where the combination of post and user must be unique. 
// This is useful in ensuring that a user can like a post only once, and you can perform efficient O(1) lookups to check if a user has liked a specific post by querying against both the post and user fields in the index.
LikeSchema.index({ post: 1, user: 1 }, { unique: true });
export default model<Like>('Like', LikeSchema);