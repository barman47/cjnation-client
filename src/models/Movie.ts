import { Document, Schema, Types, model } from 'mongoose';
import { Category } from './Category';

export interface Movie extends Document {
    title: string;
    link: string;
    thumbnailUrl: string | null;
    thumbnailName: string | null;
    genre: Types.ObjectId | Category;
    year: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

const MovieSchema = new Schema<Movie>({
    title: {
        type: String,
        required: [true, 'Movie title is required!'],
        trim: true
    },

    link: {
        type: String,
        required: [true, 'Movie download link is required!'],
        trim: true
    },

    thumbnailUrl: {
        type: String,
        required: [true, 'Thumbnail url is required!'],
        trim: true
    },

    thumbnailName: {
        type: String,
        required: [true, 'Thumbnail name is required!'],
        trim: true
    },

    genre: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Movie genre is required!']
    },

    year: {
        type: Number,
        required: [true, 'Movie year is required!']
    }
}, { timestamps: true });

MovieSchema.index(
    { title: 'text' },
    {
        name: 'MovieIndex',
        weights: {
            title: 5
        }
    }
);

export default model<Movie>('Movie', MovieSchema);