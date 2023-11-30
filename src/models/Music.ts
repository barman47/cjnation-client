import { Document, Schema, Types, model } from 'mongoose';
import { Category } from './Category';

export interface Music extends Document {
    title: string;
    artiste: string;
    mediaUrl?: string | null;
    mediaName: string | null;
    thumbnailUrl?: string | null;
    thumbnailName: string | null;
    genre: Types.ObjectId | Category;
    year: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

const MusicSchema = new Schema<Music>({
    title: {
        type: String,
        required: [true, 'Music title is required!'],
        trim: true
    },

    artiste: {
        type: String,
        required: [true, 'Artiste is required!'],
        trim: true
    },

    mediaUrl: {
        type: String,
        required: [true, 'Music url is required!'],
        trim: true
    },

    mediaName: {
        type: String,
        required: [true, 'Media name is required!'],
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
        required: [true, 'Music genre is required!']
    },

    year: {
        type: Number,
        required: [true, 'Music year is required!']
    }
}, { timestamps: true });

MusicSchema.index(
    { title: 'text', artiste: 'text' },
    {
        name: 'TextIndex',
        weights: {
            title: 5,
            artiste: 3
        }
    }
);

export default model<Music>('Music', MusicSchema);