import { Error, PostStatus } from '@/utils/constants';

export interface Post extends Error {
    category: string;
    title: string;
    body: string;
    slug?: string;
    readDuration?: number;
    mediaUrl?: string;
    mediaName?: string;
    author: string;
    status: PostStatus;
    rejectionReason: string;
    approvedAt?: Date | null;
    approvedBy?: Date | null;
    rejectedAt?: Date | null;
    rejectedBy?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}