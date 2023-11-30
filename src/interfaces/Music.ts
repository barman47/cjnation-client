import { Error } from '@/utils/constants';
import { Category } from '.';

export interface Music extends Error {
    _id?: string;
    title: string;
    artiste: string;
    mediaUrl?: string | null;
    mediaName: string | null;
    thumbnailUrl?: string | null;
    thumbnailName: string | null;
    genre: Category | string;
    year: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}