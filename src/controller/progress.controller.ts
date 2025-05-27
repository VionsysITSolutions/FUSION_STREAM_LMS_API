import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import { moduleProgressSchema, sessionAttendanceSchema, courseProgressSchema, sessionAbsesenseSchema } from '../zod/progress.schema';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import progressService from '../service/progress.service';
import { videoProgressSchema } from '../zod/submission.schema';
import batchService from '../service/batch.service';

export default {
    updateModuleProgress: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = moduleProgressSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const progress = await progressService.updateModuleProgress(result.data);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { progress });
    }),

    getModuleProgress: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { studentId, moduleId } = req.params;
        if (!studentId || !moduleId) {
            return httpError(next, new Error('Student ID and Module ID are required'), req, 400);
        }

        const progress = await progressService.getModuleProgress(Number(studentId), moduleId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { progress });
    }),

    markSessionAttendance: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = sessionAttendanceSchema.safeParse({ ...req.body, studentId: req.user?.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const attendance = await progressService.markSessionAttendance(result.data);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { attendance });
    }),

    getSessionAttendance: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const studentId = req.user?.id;
        if (!studentId) {
            return httpError(next, new Error('Student ID and Session ID are required'), req, 400);
        }

        const attendance = await progressService.getSessionAttendance(Number(studentId));
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { attendance });
    }),

    updateCourseProgress: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = courseProgressSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const progress = await progressService.updateCourseProgress(result.data);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { progress });
    }),

    getCourseProgress: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { studentId, batchId } = req.params;
        if (!studentId || !batchId) {
            return httpError(next, new Error('Student ID and Batch ID are required'), req, 400);
        }

        const progress = await progressService.getCourseProgress(Number(studentId), batchId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { progress });
    }),

    getStudentProgress: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { studentId } = req.params;
        if (!studentId) {
            return httpError(next, new Error('Student ID is required'), req, 400);
        }

        const progress = await progressService.getStudentProgress(Number(studentId));
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { progress });
    }),

    saveVideoProgress: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = videoProgressSchema.safeParse(req.body);
        const studentId = req.user?.id as number;

        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const { sessionId, time, batchId } = result.data;
        await progressService.saveVideoProgress({ userId: studentId, batchId, sessionId, time });

        return httpResponse(req, res, 200, responseMessage.SUCCESS);
    }),

    getVideoProgress: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const studentId = req.user?.id as number;
        const { batchId } = req.params

        if (!batchId) {
            return httpError(next, new Error('batchID is required'), req, 400);
        }

        const progress = await progressService.getVideoProgress(studentId, batchId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, progress);
    }),

    sessionAbsense: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = sessionAbsesenseSchema.safeParse(req.body)
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }
        const { batchId, sessionId } = result.data;

        const batch = await batchService.getBatchById(batchId)
        if (!batch) {
            return httpError(next, new Error('Batch not found'), req, 404);
        }

        let targetSession = null;
        for (const module of batch.batchModules) {
            targetSession = module?.batchModuleSessions?.find(session => session.id === sessionId);
            if (targetSession) break;
        }
        if (!targetSession) {
            return httpError(next, new Error('Session not found'), req, 404);
        }

        const enrolledStudents = batch?.batchEnrollments;
        const attendedStudentIds = targetSession?.sessionAttendance?.map(attendance => attendance?.studentId);
        const absentStudents = enrolledStudents?.filter(
            enrollment => !attendedStudentIds?.includes(enrollment?.studentId)
        );

        const smsResult = await Promise.all(
            absentStudents?.map(student =>
                progressService.sendParentStudentAbsenceSMS({
                    firstName: student.student.firstName,
                    parentsNumber: '+917498012116',
                    batchName: batch.name,
                    sessionName: targetSession.topicName,
                    sessionTime: new Date(targetSession.sessionDate),
                })
            )
        );

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { smsResult, absentStudents });
    })
};