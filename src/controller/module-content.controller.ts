import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import { createModuleContentSchema, updateModuleContentSchema, getModuleContentByIdSchema } from '../zod/course.schema';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import moduleContentService from '../service/module-content.service';

export default {
    createModuleContent: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = createModuleContentSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const moduleContent = await moduleContentService.createModuleContent(result.data);
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { moduleContent });
    }),

    getAllModuleContents: catchAsync(async (req: Request, res: Response) => {
        const moduleContents = await moduleContentService.getAllModuleContents();
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { moduleContents });
    }),

    getModuleContentById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getModuleContentByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const moduleContent = await moduleContentService.getModuleContentById(result.data.id);
        if (!moduleContent) {
            return httpError(next, new Error('Module content not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { moduleContent });
    }),

    updateModuleContent: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = getModuleContentByIdSchema.safeParse({ id: req.params.id });
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }

        const dataResult = updateModuleContentSchema.safeParse(req.body);
        if (!dataResult.success) {
            return httpError(next, new Error(quicker.zodError(dataResult)), req, 400);
        }

        const existingContent = await moduleContentService.getModuleContentById(idResult.data.id);
        if (!existingContent) {
            return httpError(next, new Error('Module content not found'), req, 404);
        }

        const updatedContent = await moduleContentService.updateModuleContent(idResult.data.id, dataResult.data);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { moduleContent: updatedContent });
    }),

    deleteModuleContent: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getModuleContentByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const existingContent = await moduleContentService.getModuleContentById(result.data.id);
        if (!existingContent) {
            return httpError(next, new Error('Module content not found'), req, 404);
        }

        await moduleContentService.deleteModuleContent(result.data.id);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Module content deleted successfully' });
    }),

    getContentByModule: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const moduleId = req.params.moduleId;
        if (!moduleId) {
            return httpError(next, new Error('Module ID is required'), req, 400);
        }

        const contents = await moduleContentService.getContentByModuleId(moduleId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { contents });
    })
};
