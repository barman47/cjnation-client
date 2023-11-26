import { Categories, Error } from '@/utils/constants';

export interface Category extends Error {
    _id?: string;
    name: string;
    type: Categories;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}