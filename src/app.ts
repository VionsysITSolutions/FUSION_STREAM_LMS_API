import express, { Application, NextFunction, Request, Response } from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import responseMessage from './constants/responseMessage';
import httpError from './util/httpError';
import apiRouter from './router/apiRouter';
import authRouter from './router/authRouter';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/', apiRouter);
app.use('/api/v1/auth', authRouter);

// 404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
    const error = new Error(responseMessage.NOT_FOUND('route'));
    httpError(next, error, req, 404);
});

app.use(globalErrorHandler);

export { app };
