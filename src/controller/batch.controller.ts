import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import batchService from '../service/batch.service';
import { createBatchSchema, updateBatchSchema, getBatchByIdSchema } from '../zod/batch.schema';
import { EnrollStudentBody } from '../types/types';

export default {
    createBatch: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body)
        const result = createBatchSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }
        const { instructors } = result.data;

        if (!instructors || instructors?.length === 0) {
            return httpError(next, new Error('At least one instructor must be assigned to the batch.'), req, 400);
        }

        const batch = await batchService.createBatch({
            ...result.data,
            startDate: new Date(result.data.startDate)
        });

        return httpResponse(req, res, 201, responseMessage.SUCCESS, { batch });
    }),

    getAllBatches: catchAsync(async (req: Request, res: Response) => {
        const batches = await batchService.getAllBatches();
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batches });
    }),

    getBatchById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getBatchByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const batch = await batchService.getBatchById(result.data.id);
        if (!batch) {
            return httpError(next, new Error('Batch not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batch });
    }),

    getBatchByInstructorId: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id as number;

        const batch = await batchService.getBatchByInstructor(userId);

        if (!batch) {
            return httpError(next, new Error('Batch not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batch });
    }),

    updateBatch: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = getBatchByIdSchema.safeParse({ id: req.params.id });
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }

        const dataResult = updateBatchSchema.safeParse(req.body);
        if (!dataResult.success) {
            return httpError(next, new Error(quicker.zodError(dataResult)), req, 400);
        }

        const existingBatch = await batchService.getBatchById(idResult.data.id);
        if (!existingBatch) {
            return httpError(next, new Error('Batch not found'), req, 404);
        }

        const updatedBatch = await batchService.updateBatch(idResult.data.id, dataResult.data);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batch: updatedBatch });
    }),

    deleteBatch: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getBatchByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const existingBatch = await batchService.getBatchById(result.data.id);
        if (!existingBatch) {
            return httpError(next, new Error('Batch not found'), req, 404);
        }

        await batchService.deleteBatch(result.data.id);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Batch deleted successfully' });
    }),

    getBatchesByCourse: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const courseId = req.params.courseId;
        if (!courseId) {
            return httpError(next, new Error('Course ID is required'), req, 400);
        }

        const batches = await batchService.getBatchesByCourseId(courseId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { batches });
    }),

    enrollStudent: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { batchId, studentId } = req.body as EnrollStudentBody;

        if (!batchId || !studentId) {
            return httpError(next, new Error('Batch ID and Student ID are required'), req, 400);
        }

        const enrollment = await batchService.enrollStudentInBatch(batchId, Number(studentId));
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { enrollment });
    }),

    getEnrolledStudents: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const batchId = req.params.batchId;
        if (!batchId) {
            return httpError(next, new Error('Batch ID is required'), req, 400);
        }

        const enrollments = await batchService.getStudentsInBatch(batchId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { enrollments });
    }),

    unenrollStudent: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { batchId, studentId } = req.body as EnrollStudentBody;

        if (!batchId || !studentId) {
            return httpError(next, new Error('Batch ID and Student ID are required'), req, 400);
        }

        await batchService.unenrollStudentFromBatch(batchId, Number(studentId));
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Student unenrolled successfully' });
    })
};
