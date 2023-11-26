import { Document, Schema, Types, model } from 'mongoose';

import { PostStatus } from '../utils/constants';

export interface Post extends Document {
    category: Types.ObjectId | string;
    title: string;
    body: string;
    slug?: string;
    readDuration?: number;
    mediaUrl?: string;
    mediaName?: string;
    author: Types.ObjectId | string;
    status: PostStatus;
    comments?: number;
    likes?:number;
    rejectionReason: string;
    approvedAt?: Date | null;
    approvedBy?: Date | null;
    rejectedAt?: Date | null;
    rejectedBy?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

const PostSchema = new Schema<Post>({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Post author is required']
    },

    title: {
        type: String,
        required: [true, 'Post title is required!'],
        trim: true
    },

    body: {
        type: String,
        required: [true, 'Post body is required!'],
        trim: true
    },

    slug: {
        type: String,
        lowercase: true
    },

    readDuration: {
        type: Number
    },

    mediaUrl: {
        type: String
    },

    mediaName: {
        type: String
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Post author is required']
    },

    status: {
        type: String,
        required: [true, 'Post status is required'],
        trim: true,
        enum: [PostStatus.APPROVED, PostStatus.DRAFT, PostStatus.PUBLISHED, PostStatus.REJECTED]
    },

    comments: {
        type: Number,
        default: 0
    },

    likes: {
        type: Number,
        default: 0
    },

    rejectionReason: {
        type: String
    },

    approvedAt: {
        type: Date
    },

    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    rejectedAt: {
        type: Date
    },

    rejectedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

// Generate slug and readTime for the post
PostSchema.pre('save', async function(next) {
    if (!this.isModified('title')) {
        next();
    }
    const slug = this.title.split(' ').join('-');
    this.slug = slug;

    const text = this.body;
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    this.readDuration = time;
    next();
});


export default model<Post>('Post', PostSchema);