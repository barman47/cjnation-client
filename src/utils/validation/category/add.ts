import Validator from 'validator';
import { isEmpty } from '../../isEmpty';
import { Category } from '../../../models/Category';
import { Categories, ErrorObject } from '../../constants';

export const validateAddCategory = (data: Category): ErrorObject<Category> => {
    let errors = {} as Category;

    data.name = !isEmpty(data.name) ?  data.name : '';
    data.type = !isEmpty(data.type) ?  data.type : '' as Categories;

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Category name is required!';
    }

    if (Validator.isEmpty(data.type)) {
        errors.type = 'Category type is required!' as Categories;
    }

    if (!Object.values(Categories).includes(data.type.toUpperCase() as Categories)) {
        errors.type = `Invalid category type: ${data.type}` as Categories;
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    } as ErrorObject<Category>;
};