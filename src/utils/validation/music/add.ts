import Validator from 'validator';
import { isEmpty } from '../../isEmpty';
import { Category } from '../../../models/Category';
import { Music } from '../../../models/Music';
import { ErrorObject } from '../../constants';

export type AddMusicData = Pick<Music, 'title' | 'artiste' | 'mediaName' | 'thumbnailName' | 'genre' | 'year'>;

export const validateAddMusic = (data: AddMusicData): ErrorObject<AddMusicData> => {
    let errors = {} as AddMusicData;

    data.title = !isEmpty(data.title) ?  data.title : '';
    data.artiste = !isEmpty(data.artiste) ?  data.artiste : '';
    data.mediaName = !isEmpty(data.mediaName) ?  data.mediaName : '';
    data.genre = !isEmpty(data.genre) ?  data.genre : '' as unknown as Category;
    data.year = !isEmpty(data.year) ?  data.year : '' as unknown as number;

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Movie title is required!';
    }

    if (Validator.isEmpty(data.artiste)) {
        errors.artiste = 'Artiste is required!';
    }

    if (Validator.isEmpty(data.mediaName!)) {
        errors.mediaName = 'Music is required!';
    }

    if (Validator.isEmpty(data.thumbnailName!)) {
        errors.thumbnailName = 'Music cover is required!';
    }

    if (Validator.isEmpty(data.genre.toString())) {
        errors.genre = 'Movie genre is required!' as unknown as  Category;
    }

    if (Validator.isEmpty(data.year.toString())) {
        errors.year = 'Movie year is required!' as unknown as number;
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    } as ErrorObject<AddMusicData>;
};