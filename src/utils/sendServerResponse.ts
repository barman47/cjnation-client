import { Response } from 'express';
import { ServerResponse } from './constants';

type SuccessResponse = Pick<ServerResponse, 'data' | 'success' | 'count' | 'msg'>;

export const sendServerResponse = (res: Response, serverResponse: ServerResponse) => {
    const { errors, msg, data, count, statusCode, success } = serverResponse;

    if (errors) {
        return res.status(statusCode).json({
            success,
            errors: { ...(errors as Record<string, string>), msg }
        });
    }

    const response: SuccessResponse = { data, success }
    if (count) {
        response.count = count;
    }

    if (msg) {
        response.msg = msg;
    }

    return res.status(statusCode).json(response);
};