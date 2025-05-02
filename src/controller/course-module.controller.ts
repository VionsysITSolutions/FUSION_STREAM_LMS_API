import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import { createCourseModuleSchema, updateCourseModuleSchema, getCourseModuleByIdSchema } from '../zod/course.schema';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import courseModuleService from '../service/course-module.service';

export default {
    createCourseModule: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = createCourseModuleSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const courseModule = await courseModuleService.createCourseModule(result.data);
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { courseModule });
    }),

    getAllCourseModules: catchAsync(async (req: Request, res: Response) => {
        const courseModules = await courseModuleService.getAllCourseModules();
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { courseModules });
    }),

    getCourseModuleById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getCourseModuleByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const courseModule = await courseModuleService.getCourseModuleById(result.data.id);
        if (!courseModule) {
            return httpError(next, new Error('Course module not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { courseModule });
    }),

    updateCourseModule: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = getCourseModuleByIdSchema.safeParse({ id: req.params.id });
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }

        const dataResult = updateCourseModuleSchema.safeParse(req.body);
        if (!dataResult.success) {
            return httpError(next, new Error(quicker.zodError(dataResult)), req, 400);
        }

        const existingModule = await courseModuleService.getCourseModuleById(idResult.data.id);
        if (!existingModule) {
            return httpError(next, new Error('Course module not found'), req, 404);
        }

        const updatedModule = await courseModuleService.updateCourseModule(idResult.data.id, dataResult.data);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { courseModule: updatedModule });
    }),

    deleteCourseModule: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getCourseModuleByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const existingModule = await courseModuleService.getCourseModuleById(result.data.id);
        if (!existingModule) {
            return httpError(next, new Error('Course module not found'), req, 404);
        }

        await courseModuleService.deleteCourseModule(result.data.id);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Course module deleted successfully' });
    }),

    getModulesByCourse: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const courseId = req.params.courseId;
        if (!courseId) {
            return httpError(next, new Error('Course ID is required'), req, 400);
        }

        const modules = await courseModuleService.getModulesByCourseId(courseId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { modules });
    })
};
