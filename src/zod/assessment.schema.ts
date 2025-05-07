import { z } from 'zod';

export const createAssessmentSchema = z.object({
    title: z
        .string({
            required_error: 'Assessment title is required',
            invalid_type_error: 'Assessment title must be a string'
        })
        .min(1, { message: 'Assessment title must not be empty' }),

    totalMarks: z
        .number({
            required_error: 'Total marks are required',
            invalid_type_error: 'Total marks must be a number'
        })
        .positive({ message: 'Total marks must be a positive number' }),

    assessmentType: z.enum(['module', 'final'], {
        required_error: 'Assessment type is required',
        invalid_type_error: 'Assessment type must be a string'
    }),

    batchModuleId: z
        .string({
            invalid_type_error: 'Batch module ID must be a string'
        })
        .optional(),

    batchId: z
        .string({
            invalid_type_error: 'Batch ID must be a string'
        })
        .optional(),

    courseId: z
        .string({
            invalid_type_error: 'Course ID must be a string'
        })
        .optional()
});

export const updateAssessmentSchema = createAssessmentSchema.partial();

export const getAssessmentByIdSchema = z.object({
    id: z
        .string({
            required_error: 'Assessment ID is required',
            invalid_type_error: 'Assessment ID must be a string'
        })
        .min(1, { message: 'Assessment ID must not be empty' })
});

export const createQuestionSchema = z.object({
    questionText: z
        .string({
            required_error: 'Question text is required',
            invalid_type_error: 'Question text must be a string'
        })
        .min(1, { message: 'Question text must not be empty' }),

    marks: z
        .number({
            required_error: 'Marks are required',
            invalid_type_error: 'Marks must be a number'
        })
        .positive({ message: 'Marks must be a positive number' }),

    assessmentType: z.enum(['module', 'final'], {
        required_error: 'Assessment type is required',
        invalid_type_error: 'Assessment type must be a string'
    }),

    moduleAssessmentId: z
        .string({
            invalid_type_error: 'Module assessment ID must be a string'
        })
        .optional(),

    finalAssessmentId: z
        .string({
            invalid_type_error: 'Final assessment ID must be a string'
        })
        .optional(),

    options: z
        .array(
            z.object({
                optionText: z
                    .string({
                        required_error: 'Option text is required',
                        invalid_type_error: 'Option text must be a string'
                    })
                    .min(1, { message: 'Option text must not be empty' }),

                isCorrect: z.boolean({
                    required_error: 'isCorrect is required',
                    invalid_type_error: 'isCorrect must be a boolean'
                })
            })
        )
        .min(2, { message: 'At least two options are required' })
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const getQuestionByIdSchema = z.object({
    id: z
        .string({
            required_error: 'Question ID is required',
            invalid_type_error: 'Question ID must be a string'
        })
        .min(1, { message: 'Question ID must not be empty' })
});
