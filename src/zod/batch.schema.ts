import { z } from 'zod';

export const createBatchSchema = z.object({
    name: z.string().min(1, 'Batch name is required'),
    description: z.string().min(1, 'Description is required'),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Start date must be a valid date'
    }),
    duration: z.number().int().positive('Duration must be a positive integer'),
    batchTimeSlot: z.enum(['morning', 'afternoon', 'evening']),
    courseId: z.string().min(1, 'Course ID is required')
});

export const updateBatchSchema = createBatchSchema.partial();

export const getBatchByIdSchema = z.object({
    id: z.string().min(1, 'Batch ID is required')
});

export const createBatchModuleSchema = z.object({
    title: z.string().min(1, 'Module title is required'),
    description: z.string().min(1, 'Description is required'),
    instructorId: z.number().int().positive('Instructor ID must be a positive integer'),
    batchId: z.string().min(1, 'Batch ID is required')
});

export const updateBatchModuleSchema = createBatchModuleSchema.partial();

export const getBatchModuleByIdSchema = z.object({
    id: z.string().min(1, 'Batch module ID is required')
});

export const createBatchSessionSchema = z.object({
    topicName: z.string().min(1, 'Topic name is required'),
    summary: z.string().min(1, 'Summary is required'),
    sessionDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Session date must be a valid date'
    }),
    meetLink: z.string().url('Meet link must be a valid URL'),
    recordingURL: z.string().url('Recording URL must be a valid URL').optional(),
    batchModuleId: z.string().min(1, 'Batch module ID is required')
});

export const updateBatchSessionSchema = createBatchSessionSchema.partial();

export const getBatchSessionByIdSchema = z.object({
    id: z.string().min(1, 'Batch session ID is required')
});
