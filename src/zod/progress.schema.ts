import { z } from 'zod';

export const moduleProgressSchema = z.object({
    studentId: z
        .number({
            required_error: 'Student ID is required',
            invalid_type_error: 'Student ID must be a number'
        })
        .int({ message: 'Student ID must be an integer' })
        .positive({ message: 'Student ID must be a positive integer' }),

    moduleId: z
        .string({
            required_error: 'Module ID is required',
            invalid_type_error: 'Module ID must be a string'
        })
        .min(1, { message: 'Module ID must not be empty' }),

    isCompleted: z.boolean({
        required_error: 'isCompleted flag is required',
        invalid_type_error: 'isCompleted must be a boolean'
    }),

    completedAt: z
        .string({
            invalid_type_error: 'completedAt must be a string'
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid date format'
        })
        .transform((val) => new Date(val))
        .optional()
});

export const sessionAttendanceSchema = z.object({
    studentId: z
        .number({
            required_error: 'Student ID is required',
            invalid_type_error: 'Student ID must be a number'
        })
        .int({ message: 'Student ID must be an integer' })
        .positive({ message: 'Student ID must be a positive integer' }),

    sessionId: z
        .string({
            required_error: 'Session ID is required',
            invalid_type_error: 'Session ID must be a string'
        })
        .min(1, { message: 'Session ID must not be empty' }),

    attendanceType: z.enum(['live', 'recorded'], {
        required_error: 'Attendance type is required',
        invalid_type_error: 'Attendance type must be either "live" or "recorded"'
    }),

    isAttended: z.boolean({
        required_error: 'isAttended flag is required',
        invalid_type_error: 'isAttended must be a boolean'
    }),

    attendedAt: z
        .string({
            invalid_type_error: 'attendedAt must be a string'
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid date format'
        })
        .transform((val) => new Date(val))
        .optional()
});

export const courseProgressSchema = z.object({
    batchId: z
        .string({
            required_error: 'Batch ID is required',
            invalid_type_error: 'Batch ID must be a string'
        })
        .min(1, { message: 'Batch ID must not be empty' }),

    studentId: z
        .number({
            required_error: 'Student ID is required',
            invalid_type_error: 'Student ID must be a number'
        })
        .int({ message: 'Student ID must be an integer' })
        .positive({ message: 'Student ID must be a positive integer' }),

    progrssPercent: z
        .number({
            required_error: 'Progress percentage is required',
            invalid_type_error: 'Progress percentage must be a number'
        })
        .min(0, { message: 'Progress percentage must be between 0 and 100' })
        .max(100, { message: 'Progress percentage must be between 0 and 100' }),

    isCompleted: z.boolean({
        required_error: 'isCompleted flag is required',
        invalid_type_error: 'isCompleted must be a boolean'
    })
});

export const sessionAbsesenseSchema = z.object({
    batchId: z
        .string({
            required_error: 'Batch ID is required',
            invalid_type_error: 'Batch ID must be a string'
        })
        .min(1, { message: 'Batch ID must not be empty' }),
    sessionId: z
        .string({
            required_error: 'Batch ID is required',
            invalid_type_error: 'Batch ID must be a string'
        })
        .min(1, { message: 'Batch ID must not be empty' }),
})