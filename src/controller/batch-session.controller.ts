import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import { createBatchSessionSchema, updateBatchSessionSchema, getBatchSessionByIdSchema } from '../zod/batch.schema';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import batchSessionService from '../service/batch-session.service';

export default {
    createBatchSession: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = createBatchSessionSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const batchSession = await batchSessionService.createBatchSession({
            ...result.data,
            sessionDate: new Date(result.data.sessionDate)
        });

        return httpResponse(req, res, 201, responseMessage.SUCCESS, { batchSession });
    }),

    getAllBatchSessions: catchAsync(async (req: Request, res: Response) => {
        const batchSessions = await batchSessionService.getAllBatchSessions();
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batchSessions });
    }),

    getBatchSessionById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getBatchSessionByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const batchSession = await batchSessionService.getBatchSessionById(result.data.id);
        if (!batchSession) {
            return httpError(next, new Error('Batch session not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batchSession });
    }),

    updateBatchSession: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = getBatchSessionByIdSchema.safeParse({ id: req.params.id });
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }

        const dataResult = updateBatchSessionSchema.safeParse(req.body);
        if (!dataResult.success) {
            return httpError(next, new Error(quicker.zodError(dataResult)), req, 400);
        }

        const existingSession = await batchSessionService.getBatchSessionById(idResult.data.id);
        if (!existingSession) {
            return httpError(next, new Error('Batch session not found'), req, 404);
        }

        const updatedSession = await batchSessionService.updateBatchSession(idResult.data.id, dataResult.data);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batchSession: updatedSession });
    }),

    deleteBatchSession: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getBatchSessionByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const existingSession = await batchSessionService.getBatchSessionById(result.data.id);
        if (!existingSession) {
            return httpError(next, new Error('Batch session not found'), req, 404);
        }

        await batchSessionService.deleteBatchSession(result.data.id);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Batch session deleted successfully' });
    }),

    getSessionsByModule: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const moduleId = req.params.moduleId;
        if (!moduleId) {
            return httpError(next, new Error('Module ID is required'), req, 400);
        }

        const sessions = await batchSessionService.getSessionsByModuleId(moduleId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { sessions });
    }),

    getPastSessions: catchAsync(async (req: Request, res: Response) => {
        const sessions = await batchSessionService.getPastSessions();
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { sessions });
    }),

    getUpcomingSessions: catchAsync(async (req: Request, res: Response) => {
        const sessions = await batchSessionService.getUpcomingSessions();
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { sessions });
    })
};
