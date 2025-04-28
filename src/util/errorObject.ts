import { Request } from 'express';
import responseMessage from '../constants/responseMessage';
import { IHttpError } from '../types/types';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): IHttpError => {
    const errorObj: IHttpError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            method: req.method,
            url: req.url
        },
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null
    };
    return errorObj;
};
