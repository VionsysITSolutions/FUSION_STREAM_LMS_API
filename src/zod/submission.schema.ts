import { z } from 'zod';

export const createSubmissionSchema = z.object({
    studentId: z.number().int().positive('Student ID must be a positive integer'),
    assessmentType: z.enum(['module', 'final']),
    moduleAssessmentId: z.string().optional(),
    finalAssessmentId: z.string().optional(),
    answers: z.array(
        z.object({
            questionId: z.string().min(1, 'Question ID is required'),
            selectedOptionId: z.string().min(1, 'Selected option ID is required')
        })
    )
});

export const getSubmissionByIdSchema = z.object({
    id: z.string().min(1, 'Submission ID is required')
});

export const getSubmissionsByAssessmentSchema = z.object({
    assessmentId: z.string().min(1, 'Assessment ID is required'),
    assessmentType: z.enum(['module', 'final'])
});

export const getSubmissionsByStudentSchema = z.object({
    studentId: z.number().int().positive('Student ID must be a positive integer')
});
