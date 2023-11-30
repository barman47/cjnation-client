import Validator from 'validator';
import { isEmpty } from '@/utils/isEmpty';
import { Category, Music } from '@/interfaces';
import { ErrorObject } from '@/utils/constants';

export type AddMusicData = Pick<Music, 'title' | 'artiste' | 'mediaName' | 'genre' | 'year'>;

export const validateAddMusic = (data: AddMusicData): ErrorObject<AddMusicData> => {
    let errors = {} as AddMusicData;

    data.title = !isEmpty(data.title) ?  data.title : '';
    data.artiste = !isEmpty(data.artiste) ?  data.artiste : '';
    data.mediaName = !isEmpty(data.mediaName) ?  data.mediaName : '';
    data.genre = !isEmpty(data.genre) ?  data.genre : '' as unknown as Category;
    data.year = !isEmpty(data.year) ?  data.year : '' as unknown as number;

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Music title is required!';
    }

    if (Validator.isEmpty(data.artiste)) {
        errors.artiste = 'Artiste is required!';
    }

    if (Validator.isEmpty(data.mediaName!)) {
        errors.mediaName = 'Music is required!';
    }

    if (Validator.isEmpty(data.genre.toString())) {
        errors.genre = 'Music genre is required!' as unknown as  Category;
    }

    if (Validator.isEmpty(data.year.toString())) {
        errors.year = 'Music year is required!' as unknown as number;
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    } as ErrorObject<AddMusicData>;
};