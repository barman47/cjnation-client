import { Category } from '@/interfaces';

export const getCategoryId = (category: string, categories: Category[]): string => {
    return categories.find((item: Category) => item.name.toLowerCase() === category.toLowerCase())?._id || '';
};