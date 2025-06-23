import { z } from 'zod';

export const createBatchSchema = z.object({
    name: z
        .string({
            required_error: 'Batch name is required',
            invalid_type_error: 'Batch name must be a string'
        })
        .min(1, { message: 'Batch name is required' }),

    description: z
        .string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string'
        })
        .min(1, { message: 'Description is required' }),

    startDate: z
        .string({
            required_error: 'Start date is required',
            invalid_type_error: 'Start date must be a string'
        })
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Start date must be a valid date'
        }),

    duration: z
        .number({
            required_error: 'Duration is required',
            invalid_type_error: 'Duration must be a number'
        })
        .int({ message: 'Duration must be an integer' })
        .positive({ message: 'Duration must be a positive integer' }),

    batchTimeSlot: z.enum(['morning', 'afternoon', 'evening'], {
        required_error: 'Batch time slot is required',
        invalid_type_error: 'Invalid time slot selected'
    }),
    capacity: z.number({
        required_error: 'Capacity is required',
        invalid_type_error: 'Capacity must be a number'
    }),

    courseId: z
        .string({
            required_error: 'Course ID is required',
            invalid_type_error: 'Course ID must be a string'
        })
        .min(1, { message: 'Course ID is required' }),

    instructors: z.array(z.number({
        required_error: 'Instructor ID is required',
        invalid_type_error: 'Instructor ID must be a number'
    })).min(1, { message: 'At least one instructor is required' })
});

export const updateBatchSchema = createBatchSchema.partial();

export const getBatchByIdSchema = z.object({
    id: z
        .string({
            required_error: 'Batch ID is required',
            invalid_type_error: 'Batch ID must be a string'
        })
        .min(1, { message: 'Batch ID is required' })
});

export const createBatchModuleSchema = z.object({
    title: z
        .string({
            required_error: 'Module title is required',
            invalid_type_error: 'Module title must be a string'
        })
        .min(1, { message: 'Module title is required' }),

    description: z
        .string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string'
        })
        .min(1, { message: 'Description is required' }),

    instructorId: z
        .number({
            required_error: 'Instructor ID is required',
            invalid_type_error: 'Instructor ID must be a number'
        })
        .int({ message: 'Instructor ID must be an integer' })
        .positive({ message: 'Instructor ID must be a positive integer' }),

    batchId: z
        .string({
            required_error: 'Batch ID is required',
            invalid_type_error: 'Batch ID must be a string'
        })
        .min(1, { message: 'Batch ID is required' })
});

export const updateBatchModuleSchema = createBatchModuleSchema.partial();

export const getBatchModuleByIdSchema = z.object({
    id: z
        .string({
            required_error: 'Batch module ID is required',
            invalid_type_error: 'Batch module ID must be a string'
        })
        .min(1, { message: 'Batch module ID is required' })
});

export const createBatchSessionSchema = z.object({
    topicName: z
        .string({
            required_error: 'Topic name is required',
            invalid_type_error: 'Topic name must be a string'
        })
        .min(1, { message: 'Topic name is required' }),

    summary: z
        .string({
            required_error: 'Summary is required',
            invalid_type_error: 'Summary must be a string'
        })
        .min(1, { message: 'Summary is required' }),

    sessionDate: z
        .string({
            required_error: 'Session date is required',
            invalid_type_error: 'Session date must be a string'
        })
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Session date must be a valid date'
        }),

    meetLink: z.string({
        required_error: 'Meet link is required',
        invalid_type_error: 'Meet link must be a string'
    }),

    recordingURL: z
        .string({
            invalid_type_error: 'Recording URL must be a string'
        })
        .url({ message: 'Recording URL must be a valid URL' })
        .optional(),

    batchModuleId: z
        .string({
            required_error: 'Batch module ID is required',
            invalid_type_error: 'Batch module ID must be a string'
        })
        .min(1, { message: 'Batch module ID is required' })
});

export const updateBatchSessionSchema = createBatchSessionSchema.partial();

export const getBatchSessionByIdSchema = z.object({
    id: z
        .string({
            required_error: 'Batch session ID is required',
            invalid_type_error: 'Batch session ID must be a string'
        })
        .min(1, { message: 'Batch session ID is required' })
});
