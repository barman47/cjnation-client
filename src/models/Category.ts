import { Document, Schema, model } from 'mongoose';

import { Categories } from '../utils/constants';

export interface Category extends Document {
    name: string;
    type: Categories;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

const CategorySchema = new Schema<Category>({
    name: {
        type: String,
        required: [true, 'Category name is required!'],
        trim: true
    },

    type: {
        type: String,
        required: [true, 'Category type is required!'],
        enum: [Categories.MOVIE, Categories.MUSIC, Categories.POST],
        trim: true
    }
}, { timestamps: true });

export default model<Category>('Category', CategorySchema);