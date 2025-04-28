import express, { Application, NextFunction, Request, Response } from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import responseMessage from './constants/responseMessage';
import httpError from './util/httpError';
import apiRouter from './router/apiRouter';

const app: Application = express();
app.use('/api/v1/', apiRouter);

// 404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
    const error = new Error(responseMessage.NOT_FOUND('route'));
    httpError(next, error, req, 404);
});

app.use(globalErrorHandler);

export { app };
