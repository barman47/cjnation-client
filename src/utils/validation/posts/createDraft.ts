import Validator from 'validator';
import { isEmpty } from '../../isEmpty';
import { Post } from '../../../models/Post';
import { ErrorObject, TITLE_LENGTH } from '../../constants';
import { PostData } from '.';

export type DraftData = Pick<Post, 'body' | 'title'>;

export const validateCreateDraft = (data: DraftData): ErrorObject<PostData> => {
    let errors = {} as PostData;

    data.body = !isEmpty(data.body) ?  data.body : '';
    data.title = !isEmpty(data.title) ?  data.title : '';

    if (Validator.isEmpty(data.body)) {
        errors.body = 'Post body is required!';
    }

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Post title is required!';
    }
    if (data.title.length > TITLE_LENGTH) {
        errors.title = `Post title should not be greater than ${TITLE_LENGTH} characters`;
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    } as ErrorObject<PostData>;
};