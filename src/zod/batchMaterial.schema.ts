import { z } from 'zod';

export const createBatchMaterialSchema = z.object({
    title: z
        .string({
            required_error: 'Title is required',
            invalid_type_error: 'Title must be a string'
        })
        .min(1, { message: 'Title must not be empty' }),

    url: z
        .string({
            required_error: 'URL is required',
            invalid_type_error: 'URL must be a string'
        })
        .url({ message: 'URL must be a valid URL' }),

    batchId: z
        .string({
            required_error: 'Batch ID is required',
            invalid_type_error: 'Batch ID must be a string'
        }),

    instructorId: z
        .number({
            required_error: 'instructorId is required',
            invalid_type_error: 'instructorId must be a number'
        })
})

export const deleteBatchMaterialId = z
    .string({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a string'
    })
    .min(1, { message: 'ID must not be empty' })

export type createMaterialType = z.infer<typeof createBatchMaterialSchema>;