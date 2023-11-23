import Validator from 'validator';
import { isEmpty } from '@/utils/isEmpty';

import { ErrorObject } from '@/utils/constants';
import { User } from '@/interfaces';

export type UserRegistrationData = Pick<User, 'name' | 'email' | 'password'>;


export const validateRegisterUser = (data: UserRegistrationData): ErrorObject<UserRegistrationData> => {
    let errors = {} as UserRegistrationData;

    data.name = !isEmpty(data.name) ?  data.name : '';
    data.email = !isEmpty(data.email) ?  data.email : '';
    data.password = !isEmpty(data.password) ?  data.password : '';

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Invalid Email Address!';
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email Address is required!';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Your name is required!';
    }

    if (!Validator.isLength(data.password, { min: 8 })) {
        errors.password = 'Password must be at least 8 characters long!';
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required!';
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    } as ErrorObject<UserRegistrationData>;
};