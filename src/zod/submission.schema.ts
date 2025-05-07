import { z } from 'zod';

export const createSubmissionSchema = z.object({
    studentId: z
        .number({
            required_error: 'Student ID is required',
            invalid_type_error: 'Student ID must be a number'
        })
        .int({ message: 'Student ID must be an integer' })
        .positive({ message: 'Student ID must be a positive integer' }),

    assessmentType: z.enum(['module', 'final'], {
        required_error: 'Assessment type is required',
        invalid_type_error: 'Assessment type must be either "module" or "final"'
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

    answers: z.array(
        z.object({
            questionId: z
                .string({
                    required_error: 'Question ID is required',
                    invalid_type_error: 'Question ID must be a string'
                })
                .min(1, { message: 'Question ID must not be empty' }),

            selectedOptionId: z
                .string({
                    required_error: 'Selected option ID is required',
                    invalid_type_error: 'Selected option ID must be a string'
                })
                .min(1, { message: 'Selected option ID must not be empty' })
        }),
        {
            required_error: 'Answers are required',
            invalid_type_error: 'Answers must be an array'
        }
    )
});

export const getSubmissionByIdSchema = z.object({
    id: z
        .string({
            required_error: 'Submission ID is required',
            invalid_type_error: 'Submission ID must be a string'
        })
        .min(1, { message: 'Submission ID must not be empty' })
});

export const getSubmissionsByAssessmentSchema = z.object({
    assessmentId: z
        .string({
            required_error: 'Assessment ID is required',
            invalid_type_error: 'Assessment ID must be a string'
        })
        .min(1, { message: 'Assessment ID must not be empty' }),

    assessmentType: z.enum(['module', 'final'], {
        required_error: 'Assessment type is required',
        invalid_type_error: 'Assessment type must be either "module" or "final"'
    })
});

export const getSubmissionsByStudentSchema = z.object({
    studentId: z
        .number({
            required_error: 'Student ID is required',
            invalid_type_error: 'Student ID must be a number'
        })
        .int({ message: 'Student ID must be an integer' })
        .positive({ message: 'Student ID must be a positive integer' })
});
