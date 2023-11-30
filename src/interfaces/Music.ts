import { Error } from '@/utils/constants';
import { Category } from '.';

export interface Music extends Error {
    title: string;
    artiste: string;
    mediaUrl?: string | null;
    mediaName: string | null;
    thumbnailUrl?: string | null;
    thumbnailName: string | null;
    genre: String | Category;
    year: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}