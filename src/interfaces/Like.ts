import { Error } from '@/utils/constants';

export interface Like extends Error {
    _id?: string;
    post: string;
    user: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}