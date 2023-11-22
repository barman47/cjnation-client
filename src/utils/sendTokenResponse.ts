import {  Response } from 'express';
import { User } from '../models/User';
import { sendServerResponse } from './sendServerResponse';

interface Options {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
}

export const sendTokenResponse = (user: User, statusCode: number, msg: string, res: Response) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options: Options = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    user.set('password', undefined)

    sendServerResponse(res, { statusCode, success: true, data: { token, user  },  msg });
};