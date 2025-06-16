import { z } from 'zod';

export const createCourseSchema = z.object({
    name: z
        .string({
            required_error: 'Course name is required',
            invalid_type_error: 'Course name must be a string'
        })
        .min(1, { message: 'Course name must not be empty' }),

    description: z
        .string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string'
        })
        .min(1, { message: 'Description must not be empty' }),

    price: z
        .number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number'
        })
        .positive({ message: 'Price must be a positive number' }),

    thumbnailUrl: z
        .string({
            required_error: 'Thumbnail URL is required',
            invalid_type_error: 'Thumbnail URL must be a string'
        })
        .url({ message: 'Thumbnail URL must be a valid URL' }),

    category: z.string().optional(),

    createdById: z
        .number({
            required_error: 'Creator ID is required',
            invalid_type_error: 'Creator ID must be a number'
        })
        .int({ message: 'Creator ID must be an integer' })
        .positive({ message: 'Creator ID must be a positive integer' })
});

export const updateCourseSchema = createCourseSchema.partial().extend({
    thumbnailUrl: z.string().url().optional().nullable()
});

export const getCourseByIdSchema = z.object({
    id: z
        .string({
            required_error: 'Course ID is required',
            invalid_type_error: 'Course ID must be a string'
        })
        .min(1, { message: 'Course ID must not be empty' })
});

export const createCourseModuleSchema = z.object({
    title: z
        .string({
            required_error: 'Module title is required',
            invalid_type_error: 'Module title must be a string'
        })
        .min(1, { message: 'Module title must not be empty' }),

    summary: z.string().optional(),

    courseId: z
        .string({
            required_error: 'Course ID is required',
            invalid_type_error: 'Course ID must be a string'
        })
        .min(1, { message: 'Course ID must not be empty' })
});

export const updateCourseModuleSchema = createCourseModuleSchema.partial();

export const getCourseModuleByIdSchema = z.object({
    id: z
        .string({
            required_error: 'Course module ID is required',
            invalid_type_error: 'Course module ID must be a string'
        })
        .min(1, { message: 'Course module ID must not be empty' })
});

export const createModuleContentSchema = z.object({
    name: z
        .string({
            required_error: 'Content name is required',
            invalid_type_error: 'Content name must be a string'
        })
        .min(1, { message: 'Content name must not be empty' }),

    description: z.string().optional(),

    mediaUrl: z
        .string({
            required_error: 'Media URL is required',
            invalid_type_error: 'Media URL must be a string'
        })
        .url({ message: 'Media URL must be a valid URL' }),

    moduleId: z
        .string({
            required_error: 'Module ID is required',
            invalid_type_error: 'Module ID must be a string'
        })
        .min(1, { message: 'Module ID must not be empty' })
});

export const updateModuleContentSchema = createModuleContentSchema.partial();

export const getModuleContentByIdSchema = z.object({
    id: z
        .string({
            required_error: 'Module content ID is required',
            invalid_type_error: 'Module content ID must be a string'
        })
        .min(1, { message: 'Module content ID must not be empty' })
});

export const approveCourseSchema = z.object({
    id: z
        .string({
            required_error: 'Course ID is required',
            invalid_type_error: 'Course ID must be a string'
        })
        .min(1, { message: 'Course ID must not be empty' })
});
