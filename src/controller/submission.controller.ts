import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import {
    createSubmissionSchema,
    getSubmissionByIdSchema,
    getSubmissionsByAssessmentAndStudentSchema,
    getSubmissionsByAssessmentSchema
} from '../zod/submission.schema';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import submissionService from '../service/submission.service';
import { Role } from '@prisma/client';

interface User {
    id: number;
    email: string;
    role: Role;
}

interface SubmissionRequest extends Request {
    user?: User;
}

export default {
    createSubmission: catchAsync(async (req: SubmissionRequest, res: Response, next: NextFunction) => {
        const studentId = req.user?.id;

        if (!studentId) {
            return httpError(next, new Error('Student ID is required'), req, 400);
        }

        const result = createSubmissionSchema.safeParse({ ...req.body, studentId });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        // Set student ID from authenticated user if not provided
        if (!result.data.studentId && req.user?.id) {
            result.data.studentId = req.user.id;
        }

        const submission = await submissionService.createSubmission(result.data);
        if (!submission) {
            return httpError(next, new Error('Failed to create submission'), req, 500);
        }

        const assessmentId = result.data.moduleAssessmentId ?? result.data.finalAssessmentId;

        if (!assessmentId) {
            return httpError(next, new Error('Assessment ID is required'), req, 400);
        }

        await submissionService.deleteAssessmentSubmissionFromRedis(String(result.data.studentId), assessmentId);
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { submission });
    }),

    getSubmissionById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getSubmissionByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const submission = await submissionService.getSubmissionById(result.data.id);
        if (!submission) {
            return httpError(next, new Error('Submission not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { submission });
    }),

    getSubmissionsByAssessment: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getSubmissionsByAssessmentSchema.safeParse({
            assessmentId: req.params.assessmentId,
            assessmentType: req.params.type
        });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const submissions = await submissionService.getSubmissionsByAssessment(result.data.assessmentId, result.data.assessmentType);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { submissions });
    }),

    getSubmissionsByStudent: catchAsync(async (req: SubmissionRequest, res: Response, next: NextFunction) => {
        let studentId: number;

        // If getting current user's submissions
        if (req.params.studentId === 'me' && req.user?.id) {
            studentId = req.user.id;
        } else {
            studentId = Number(req.params.studentId);
            if (isNaN(studentId)) {
                return httpError(next, new Error('Valid student ID is required'), req, 400);
            }
        }

        const submissions = await submissionService.getSubmissionsByStudent(studentId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { submissions });
    }),

    getSubmissionsByAssessmentAndStudent: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getSubmissionsByAssessmentAndStudentSchema.safeParse({
            assessmentId: req.params.assessmentId,
            assessmentType: req.params.type,
            studentId: Number(req.user?.id)
        });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }
        const submissions = await submissionService.getSubmissionsByAssessmentAndStudent(
            result.data.assessmentId,
            result.data.assessmentType,
            result.data.studentId
        );
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { submissions });
    })
};
