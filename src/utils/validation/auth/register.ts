import Validator from 'validator';
import { isEmpty } from '../../isEmpty';
import { User } from '../../../models/User';

import { ErrorObject, Role, UserRole } from '../../../utils/constants';

export type UserRegistrationData = Pick<User, 'name' | 'email' | 'password' | 'phone' | 'location' | 'role'>;


export const validateRegisterUser = (data: UserRegistrationData): ErrorObject<UserRegistrationData> => {
    let errors = {} as UserRegistrationData;

    data.name = !isEmpty(data.name) ?  data.name : '';
    data.email = !isEmpty(data.email) ?  data.email : '';
    data.phone = !isEmpty(data.phone) ?  data.phone : '';
    data.location = !isEmpty(data.location) ?  data.location : '';
    data.password = !isEmpty(data.password) ?  data.password : '';
    data.role = !isEmpty(data.role) ?  data.role : '' as UserRole;

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Invalid Email Address!';
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email Address is required!';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Your name is required!';
    }

    // if (Validator.isMobilePhone(data.phone)) {
    //     errors.phone = 'Invalid phone number!';
    // }
    if (Validator.isEmpty(data.phone)) {
        errors.phone = 'Phone number is required!';
    }

    if (Validator.isEmpty(data.location)) {
        errors.location = 'Location is required!';
    }


    if (!Validator.isLength(data.password, { min: 8 })) {
        errors.password = 'Password must be at least 8 characters long!';
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required!';
    }

    if (!(data.role.toUpperCase() in Role)) {
        errors.role = `Invalid user role '${data.role}'!` as UserRole;
    }
    if (Validator.isEmpty(data.role)) {
        errors.role = 'User role is required!' as UserRole;
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    } as ErrorObject<UserRegistrationData>;
};