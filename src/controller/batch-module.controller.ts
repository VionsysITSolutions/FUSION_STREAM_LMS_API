import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import { createBatchModuleSchema, updateBatchModuleSchema, getBatchModuleByIdSchema } from '../zod/batch.schema';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import batchModuleService from '../service/batch-module.service';

export default {
    createBatchModule: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = createBatchModuleSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const batchModule = await batchModuleService.createBatchModule(result.data);
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { batchModule });
    }),

    getAllBatchModules: catchAsync(async (req: Request, res: Response) => {
        const batchModules = await batchModuleService.getAllBatchModules();
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batchModules });
    }),

    getBatchModuleById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getBatchModuleByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const batchModule = await batchModuleService.getBatchModuleById(result.data.id);
        if (!batchModule) {
            return httpError(next, new Error('Batch module not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batchModule });
    }),

    updateBatchModule: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = getBatchModuleByIdSchema.safeParse({ id: req.params.id });
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }

        const dataResult = updateBatchModuleSchema.safeParse(req.body);
        if (!dataResult.success) {
            return httpError(next, new Error(quicker.zodError(dataResult)), req, 400);
        }

        const existingModule = await batchModuleService.getBatchModuleById(idResult.data.id);
        if (!existingModule) {
            return httpError(next, new Error('Batch module not found'), req, 404);
        }

        const updatedModule = await batchModuleService.updateBatchModule(idResult.data.id, dataResult.data);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batchModule: updatedModule });
    }),

    deleteBatchModule: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getBatchModuleByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const existingModule = await batchModuleService.getBatchModuleById(result.data.id);
        if (!existingModule) {
            return httpError(next, new Error('Batch module not found'), req, 404);
        }

        await batchModuleService.deleteBatchModule(result.data.id);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Batch module deleted successfully' });
    }),

    getModulesByBatch: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const batchId = req.params.batchId;
        if (!batchId) {
            return httpError(next, new Error('Batch ID is required'), req, 400);
        }

        const modules = await batchModuleService.getModulesByBatchId(batchId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { modules });
    }),

    getModulesByInstructor: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const instructorId = req.params.instructorId;
        if (!instructorId || isNaN(Number(instructorId))) {
            return httpError(next, new Error('Valid instructor ID is required'), req, 400);
        }

        const modules = await batchModuleService.getModulesByInstructorId(Number(instructorId));
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { modules });
    })
};
