import Validator from 'validator';
import { isEmpty } from '../../isEmpty';

import { ErrorObject } from '../../constants';
import { Category } from '../../../models/Category';
import { Movie } from '../../../models/Movie';

export type EditMovieData = Pick<Movie, 'title' | 'link' | 'genre' | 'year'>;

export const validateEditMovie = (data: EditMovieData): ErrorObject<EditMovieData> => {
    let errors = {} as EditMovieData;

    data.title = !isEmpty(data.title) ?  data.title : '';
    data.link = !isEmpty(data.link) ?  data.link : '';
    data.genre = !isEmpty(data.genre) ?  data.genre : '' as unknown as Category;
    data.year = !isEmpty(data.year) ?  data.year : '' as unknown as number;

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Movie title is required!';
    }

    if (!Validator.isURL(data.link)) {
        errors.link = 'Invalid download link is required!';
    }
    if (Validator.isEmpty(data.link)) {
        errors.link = 'Movie download link is required!';
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
    } as ErrorObject<EditMovieData>;
};