import { Response } from 'express';
import { sendServerResponse } from './sendServerResponse';

export const returnError = (err: any, res: Response, status: number, msg: string) => {
    console.error(err);
    return sendServerResponse(res, { errors: { }, msg, success: false, statusCode: status });
};