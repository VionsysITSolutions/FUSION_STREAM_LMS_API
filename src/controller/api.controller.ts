import { Request, Response } from 'express';
import httpResponse from '../util/httpResponse';

export default {
    get: (req: Request, res: Response) => {
        return httpResponse(req, res, 200, 'API is running successfully', {});
    }
};
