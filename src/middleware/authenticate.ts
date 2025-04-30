import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import userServices from '../service/user.service';
import httpError from '../util/httpError';
import catchAsync from '../util/catchAsync';
import { JwtPayload } from '../types/types';

const authenticateUser = (...allowedRoles: string[]) =>
    catchAsync(async (req: Request, _: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return httpError(next, new Error('Authorization token missing'), req, 401);
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return httpError(next, new Error('user is not logged in'), req, 403);
        }

        const decoded = jwt.verify(token, config.JWT_SECRET as string) as JwtPayload;

        const user = await userServices.findById(decoded.id);
        if (!user || user.isDeleted) {
            return httpError(next, new Error('User not found or deleted'), req, 401);
        }

        // Role check
        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
            return httpError(next, new Error('Access denied'), req, 403);
        }

        next();
    });

export default authenticateUser;
