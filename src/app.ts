import express, { Application, NextFunction, Request, Response } from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import responseMessage from './constants/responseMessage';
import httpError from './util/httpError';
import apiRouter from './router/api.route';
import authRouter from './router/auth.route';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import batchRouter from './router/batch.route';
import courseRouter from './router/course.route';
import courseModuleRouter from './router/course-module.route';
import moduleContentRouter from './router/module-content.route';
import batchModuleRouter from './router/batch-module.route';
import batchSessionRouter from './router/batch-session.route';
import chatRouter from './router/chat.route';
import userRouter from './router/user.route';
import assessmentRouter from './router/assessment.route';
import submissionRouter from './router/submission.route';
import progressRouter from './router/progress.route';
import courseEnrollmentRouter from './router/courseEnrollment.route';
import webhookRouter from './router/webhooks.route';
import certificateRouter from './router/certificate.route';
import config from './config';
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
app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/course-module', courseModuleRouter);
app.use('/api/v1/course-module-content', moduleContentRouter);
app.use('/api/v1/batch', batchRouter);
app.use('/api/v1/batch-module', batchModuleRouter);
app.use('/api/v1/batch-module-session', batchSessionRouter);
app.use('/api/v1/batch-session/chats', chatRouter);
app.use('/api/v1/assessment', assessmentRouter);
app.use('/api/v1/submission', submissionRouter);
app.use('/api/v1/progress', progressRouter);
app.use('/api/v1/enrollment', courseEnrollmentRouter);
app.use('/api/v1/certificate', certificateRouter);
app.use('/api/v1/webhook', express.raw({ type: 'application/json' }), webhookRouter);

// 404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
    const error = new Error(responseMessage.NOT_FOUND('route'));
    httpError(next, error, req, 404);
});

app.use(globalErrorHandler);

export { app };
