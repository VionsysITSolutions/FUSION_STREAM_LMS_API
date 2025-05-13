import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import { createCourseSchema, updateCourseSchema, getCourseByIdSchema, approveCourseSchema } from '../zod/course.schema';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import courseService from '../service/course.service';

export default {
    createCourse: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = createCourseSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const course = await courseService.createCourse(result.data);
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { course });
    }),

    getAllCourses: catchAsync(async (req: Request, res: Response) => {
        const courses = await courseService.getAllCourses();
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { courses });
    }),

    getCourseById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getCourseByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const course = await courseService.getCourseById(result.data.id);
        if (!course) {
            return httpError(next, new Error('Course not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { course });
    }),

    updateCourse: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = getCourseByIdSchema.safeParse({ id: req.params.id });
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }

        const dataResult = updateCourseSchema.safeParse(req.body);
        if (!dataResult.success) {
            return httpError(next, new Error(quicker.zodError(dataResult)), req, 400);
        }

        const existingCourse = await courseService.getCourseById(idResult.data.id);
        if (!existingCourse) {
            return httpError(next, new Error('Course not found'), req, 404);
        }
        const thumbnailUrl = dataResult.data.thumbnailUrl ?? existingCourse.thumbnailUrl;

        const updatedCourse = await courseService.updateCourse(idResult.data.id, { ...dataResult.data, thumbnailUrl });
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { course: updatedCourse });
    }),

    deleteCourse: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getCourseByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const existingCourse = await courseService.getCourseById(result.data.id);
        if (!existingCourse) {
            return httpError(next, new Error('Course not found'), req, 404);
        }

        await courseService.deleteCourse(result.data.id);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Course deleted successfully' });
    }),

    approveCourse: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = approveCourseSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }
        const existingCourse = await courseService.getCourseById(result.data.id);
        if (!existingCourse) {
            return httpError(next, new Error('Course not found'), req, 404);
        }

        if (!req.user?.id) {
            return httpError(next, new Error('User ID is required'), req, 400);
        }

        const approvedCourse = await courseService.approveCourse(result.data.id, req.user.id, existingCourse.isApproved);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { course: approvedCourse });
    }),

    getCreatedCourses: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const createdById = Number(req.params.createdById);
        if (isNaN(createdById)) {
            return httpError(next, new Error('Valid creator ID is required'), req, 400);
        }

        const courses = await courseService.getCreatedCourses(createdById);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { courses });
    }),

    getApprovedCourses: catchAsync(async (req: Request, res: Response) => {
        const courses = await courseService.getApprovedCourses();
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { courses });
    })
};
