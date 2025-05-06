import { z } from 'zod';

export const createAssessmentSchema = z.object({
    title: z.string().min(1, 'Assessment title is required'),
    totalMarks: z.number().positive('Total marks must be a positive number'),
    assessmentType: z.enum(['module', 'final'], {
        errorMap: () => ({ message: 'Assessment type must be either module or final' })
    }),
    batchModuleId: z.string().optional(),
    batchId: z.string().optional(),
    courseId: z.string().optional()
});

export const updateAssessmentSchema = createAssessmentSchema.partial();

export const getAssessmentByIdSchema = z.object({
    id: z.string().min(1, 'Assessment ID is required')
});

export const createQuestionSchema = z.object({
    questionText: z.string().min(1, 'Question text is required'),
    marks: z.number().positive('Marks must be a positive number'),
    assessmentType: z.enum(['module', 'final']),
    moduleAssessmentId: z.string().optional(),
    finalAssessmentId: z.string().optional(),
    options: z
        .array(
            z.object({
                optionText: z.string().min(1, 'Option text is required'),
                isCorrect: z.boolean()
            })
        )
        .min(2, 'At least two options are required')
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const getQuestionByIdSchema = z.object({
    id: z.string().min(1, 'Question ID is required')
});
