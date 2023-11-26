import { Error } from '@/utils/constants';
import { User } from '.';

export interface Comment extends Error {
    _id?: string;
    text: string;
    post: string;
    user: User | string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}