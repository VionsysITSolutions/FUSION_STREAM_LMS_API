import { z } from 'zod';

export const createCourseSchema = z.object({
    name: z.string().min(1, 'Course name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be a positive number'),
    thumbnailUrl: z.string().url('Thumbnail URL must be a valid URL'),
    category: z.string().optional(),
    createdById: z.number().int().positive('Creator ID must be a positive integer')
});

export const updateCourseSchema = createCourseSchema.partial();

export const getCourseByIdSchema = z.object({
    id: z.string().min(1, 'Course ID is required')
});

export const createCourseModuleSchema = z.object({
    title: z.string().min(1, 'Module title is required'),
    summary: z.string().optional(),
    courseId: z.string().min(1, 'Course ID is required')
});

export const updateCourseModuleSchema = createCourseModuleSchema.partial();

export const getCourseModuleByIdSchema = z.object({
    id: z.string().min(1, 'Course module ID is required')
});

export const createModuleContentSchema = z.object({
    name: z.string().min(1, 'Content name is required'),
    description: z.string().optional(),
    mediaUrl: z.string().url('Media URL must be a valid URL'),
    moduleId: z.string().min(1, 'Module ID is required')
});

export const updateModuleContentSchema = createModuleContentSchema.partial();

export const getModuleContentByIdSchema = z.object({
    id: z.string().min(1, 'Module content ID is required')
});

export const approveCourseSchema = z.object({
    id: z.string().min(1, 'Course ID is required')
});
