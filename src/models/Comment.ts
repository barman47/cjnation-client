import { Document, Schema, Types, model } from 'mongoose';

export interface Comment extends Document {
    text: string;
    post: Types.ObjectId | string;
    user: Types.ObjectId | string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

const CommentSchema = new Schema<Comment>({
    text: {
        type: String,
        required: [true, 'Post comment is required!'],
        trim: true
    },

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


export default model<Comment>('Comment', CommentSchema);