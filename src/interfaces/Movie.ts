import { Error } from '@/utils/constants';
import { Category } from '.';

export interface Movie extends Error {
    title: string;
    link: string;
    thumbnailUrl: string | null;
    thumbnailName: string | null;
    genre: Category | string;
    year: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}