import { Request, Response, NextFunction } from 'express';
import httpError from './httpError';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export default (fn: AsyncFunction) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            return httpError(next, error || new Error('Internal server error'), req, 500);
        }
    };
};
