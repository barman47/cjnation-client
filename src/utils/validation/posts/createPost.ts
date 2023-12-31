import Validator from 'validator';
import { isEmpty } from '@/utils/isEmpty';
import { Post } from '@/interfaces';
import { ErrorObject, TITLE_LENGTH } from '@/utils/constants';

export type PostData = Pick<Post, 'category' | 'body' | 'title' | 'mediaUrl' | 'author'>;

export const validateCreatePost = (data: PostData): ErrorObject<PostData> => {
    let errors = {} as PostData;

    data.category = !isEmpty(data.category) ?  data.category : '';
    data.body = !isEmpty(data.body) ?  data.body : '';
    data.title = !isEmpty(data.title) ?  data.title : '';
    data.mediaUrl = !isEmpty(data.mediaUrl) ?  data.mediaUrl : '';
    data.author = !isEmpty(data.author) ?  data.author : '';

    if (Validator.isEmpty(data.category.toString())) {
        errors.category = 'Post category is required!';
    }

    if (Validator.isEmpty(data.body)) {
        errors.body = 'Post body is required!';
    }

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Post title is required!';
    }
    if (data.title.length > TITLE_LENGTH) {
        errors.title = `Post title should not be greater than ${TITLE_LENGTH} characters`;
    }

    if (Validator.isEmpty(data.mediaUrl!)) {
        errors.mediaUrl = 'Post image is required!';
    }

    if (Validator.isEmpty(data.author.toString())) {
        errors.author = 'Post author is required!';
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    } as ErrorObject<PostData>;
};