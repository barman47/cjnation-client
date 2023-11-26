import { Error } from '@/utils/constants';

export interface Comment extends Error {
    _id?: string;
    text: string;
    post: string;
    user: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}