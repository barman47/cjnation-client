import { Error, PostStatus } from '@/utils/constants';
import { Category, User } from '.';

export interface Post extends Error {
    _id?: string;
    category: Category |string;
    title: string;
    body: string;
    slug?: string;
    readDuration?: number;
    mediaUrl?: string;
    mediaName?: string;
    author: string | User;
    status: PostStatus;
    comments: number;
    likes: number;
    rejectionReason: string;
    approvedAt?: Date | null;
    approvedBy?: Date | null;
    rejectedAt?: Date | null;
    rejectedBy?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}