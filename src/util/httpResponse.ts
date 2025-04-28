import { Request, Response } from 'express';
import { IHttpResponse } from '../types/types';

export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null): void => {
    const response: IHttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            method: req.method,
            url: req.url
        },
        message: responseMessage,
        data: data
    };
    res.status(responseStatusCode).json(response);
};
