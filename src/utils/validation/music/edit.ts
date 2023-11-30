import Validator from 'validator';
import { isEmpty } from '@/utils/isEmpty';
import { Category, Music } from '@/interfaces';
import { ErrorObject } from '@/utils/constants';

export type EditMusicData = Pick<Music, 'title' | 'artiste' | 'genre' | 'year'>;

export const validateEditMusic = (data: EditMusicData): ErrorObject<EditMusicData> => {
    let errors = {} as EditMusicData;

    data.title = !isEmpty(data.title) ?  data.title : '';
    data.artiste = !isEmpty(data.artiste) ?  data.artiste : '';
    data.genre = !isEmpty(data.genre) ?  data.genre : '' as unknown as Category;
    data.year = !isEmpty(data.year) ?  data.year : '' as unknown as number;

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Music title is required!';
    }

    if (Validator.isEmpty(data.artiste)) {
        errors.artiste = 'Artiste is required!';
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
    } as ErrorObject<EditMusicData>;
};