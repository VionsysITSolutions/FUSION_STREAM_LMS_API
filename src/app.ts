import express, { Application, NextFunction, Request, Response } from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import responseMessage from './constants/responseMessage';
import httpError from './util/httpError';
import apiRouter from './router/api.route';
import authRouter from './router/auth.route';
import config from './config';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
const app: Application = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

app.use(cookieParser());
app.use(
    cors({
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'PUT'],
        origin: config.FRONTEND_URL,
        credentials: true
    })
);

app.use('/api/v1/', apiRouter);
app.use('/api/v1/auth', authRouter);

// 404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
    const error = new Error(responseMessage.NOT_FOUND('route'));
    httpError(next, error, req, 404);
});

app.use(globalErrorHandler);

export { app };
