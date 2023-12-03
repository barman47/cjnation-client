import Validator from 'validator';
import { isEmpty } from '@/utils/isEmpty';
import { Category, Movie } from '@/interfaces';
import { ErrorObject } from '@/utils/constants';

export type AddMovieData = Pick<Movie, 'title' | 'link' | 'thumbnailName' | 'genre' | 'year'>;

export const validateAddMovie = (data: AddMovieData): ErrorObject<AddMovieData> => {
    let errors = {} as AddMovieData;

    data.title = !isEmpty(data.title) ?  data.title : '';
    data.link = !isEmpty(data.link) ?  data.link : '';
    data.thumbnailName = !isEmpty(data.thumbnailName) ?  data.thumbnailName : '';
    data.genre = !isEmpty(data.genre) ?  data.genre : '' as unknown as Category;
    data.year = !isEmpty(data.year) ?  data.year : '' as unknown as number;

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Movie title is required!';
    }

    if (!Validator.isURL(data.link)) {
        errors.link = 'Invalid download link!';
    }
    if (Validator.isEmpty(data.link)) {
        errors.link = 'Movie download link is required!';
    }

    if (Validator.isEmpty(data.thumbnailName!)) {
        errors.thumbnailName = 'Movie thumbnail is required!';
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
    } as ErrorObject<AddMovieData>;
};