import { z } from 'zod';

export const moduleProgressSchema = z.object({
    studentId: z.number().int().positive('Student ID must be a positive integer'),
    moduleId: z.string().min(1, 'Module ID is required'),
    isCompleted: z.boolean(),
    completedAt: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid date format'
        })
        .transform((val) => new Date(val))
        .optional()
});

export const sessionAttendanceSchema = z.object({
    studentId: z.number().int().positive('Student ID must be a positive integer'),
    sessionId: z.string().min(1, 'Session ID is required'),
    attendanceType: z.enum(['live', 'recorded']),
    isAttended: z.boolean(),
    attendedAt: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid date format'
        })
        .transform((val) => new Date(val))
        .optional()
});

export const courseProgressSchema = z.object({
    batchId: z.string().min(1, 'Batch ID is required'),
    studentId: z.number().int().positive('Student ID must be a positive integer'),
    progrssPercent: z.number().min(0).max(100, 'Progress percentage must be between 0 and 100'),
    isCompleted: z.boolean()
});
