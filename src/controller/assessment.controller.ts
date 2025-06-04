import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import {
    createAssessmentSchema,
    createQuestionSchema,
    updateQuestionSchema,
    getQuestionByIdSchema,
    saveAssessmentStatusSchema
} from '../zod/assessment.schema';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import assessmentService from '../service/assessment.service';
import { Role } from '@prisma/client';

interface User {
    id: number;
    email: string;
    role: Role;
}

interface AssessmentRequest extends Request {
    user?: User;
}

export default {
    createAssessment: catchAsync(async (req: AssessmentRequest, res: Response, next: NextFunction) => {
        const result = createAssessmentSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        let assessment;
        if (result.data.assessmentType === 'module') {
            if (!result.data.batchModuleId) {
                return httpError(next, new Error('Batch module ID is required for module assessment'), req, 400);
            }
            assessment = await assessmentService.createModuleAssessment(result.data);
        } else {
            if (!result.data.batchId || !result.data.courseId) {
                return httpError(next, new Error('Batch ID and Course ID are required for final assessment'), req, 400);
            }
            assessment = await assessmentService.createFinalAssessment(result.data);
        }

        return httpResponse(req, res, 201, responseMessage.SUCCESS, { assessment });
    }),
    updateAssessment: catchAsync(async (req: AssessmentRequest, res: Response, next: NextFunction) => {
        const result = createAssessmentSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const { id } = req.params;
        if (!id) {
            return httpError(next, new Error('Assessment ID is required'), req, 400);
        }

        let updatedAssessment;

        if (result.data.assessmentType === 'module') {
            if (!result.data.batchModuleId) {
                return httpError(next, new Error('Batch module ID is required for module assessment'), req, 400);
            }

            updatedAssessment = await assessmentService.updateModuleAssessment(id, result.data);
        } else {
            if (!result.data.batchId || !result.data.courseId) {
                return httpError(next, new Error('Batch ID and Course ID are required for final assessment'), req, 400);
            }

            updatedAssessment = await assessmentService.updateFinalAssessment(id, result.data);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { assessment: updatedAssessment });
    }),

    getAssessmentById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id, type } = req.params;
        if (!id || !type) {
            return httpError(next, new Error('Assessment ID and type are required'), req, 400);
        }

        const assessment =
            type === 'module' ? await assessmentService.getModuleAssessmentById(id) : await assessmentService.getFinalAssessmentById(id);

        if (!assessment) {
            return httpError(next, new Error('Assessment not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { assessment });
    }),

    createQuestion: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = createQuestionSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const question = await assessmentService.createQuestion(result.data);
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { question });
    }),

    updateQuestion: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = getQuestionByIdSchema.safeParse({ id: req.params.id });
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }

        const dataResult = updateQuestionSchema.safeParse(req.body);
        if (!dataResult.success) {
            return httpError(next, new Error(quicker.zodError(dataResult)), req, 400);
        }

        const question = await assessmentService.updateQuestion(idResult.data.id, dataResult.data);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { question });
    }),

    deleteQuestion: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getQuestionByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        await assessmentService.deleteQuestion(result.data.id);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Question deleted successfully' });
    }),

    getQuestionsByAssessment: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { assessmentId, type } = req.params;
        if (!assessmentId || !type) {
            return httpError(next, new Error('Assessment ID and type are required'), req, 400);
        }

        const questions = await assessmentService.getQuestionsByAssessment(assessmentId, type as 'module' | 'final');
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { questions });
    }),

    saveAssessmentStatus: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = saveAssessmentStatusSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }
        const { assessmentId, answers, currentIndex } = result.data;
        const userId = req.user?.id;
        if (typeof userId !== 'number') {
            return httpError(next, new Error('User ID is required'), req, 400);
        }
        await assessmentService.saveAssessmentStatusToRedis(assessmentId, userId, answers, currentIndex);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Assessment status saved successfully' });
    }),

    getAssessmentStatus: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { assessmentId } = req.params;
        if (!assessmentId) {
            return httpError(next, new Error('Assessment ID is required'), req, 400);
        }
        const userId = req.user?.id;
        if (typeof userId !== 'number') {
            return httpError(next, new Error('User ID is required'), req, 400);
        }
        console.log(assessmentId, userId);
        const status = await assessmentService.getAssessmentStatusFromRedis(assessmentId, userId);

        if (!status) {
            return httpError(next, new Error('No assessment status found'), req, 404);
        }
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { status: status });
    })
};
