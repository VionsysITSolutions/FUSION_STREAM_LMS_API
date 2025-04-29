import { NextFunction, Request } from 'express';
import errorObject from './errorObject';
import { ZodIssue } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (nextFunc: NextFunction, err: ZodIssue | Error | unknown, req: Request, errorStatusCode: number = 500): void => {
    const status = errorStatusCode >= 400 && errorStatusCode < 500 ? errorStatusCode : 500;
    const errorObj = errorObject(err, req, status);
    return nextFunc(errorObj);
};
