import prisma from '../lib/db';
import { UpdateCourseModuleBody } from '../types/types';

export default {
    createCourseModule: async (moduleData: { title: string; summary?: string; courseId: string }) => {
        return prisma.course_module.create({
            data: moduleData,
            include: {
                course: true
            }
        });
    },

    // optional
    getAllCourseModules: async () => {
        return prisma.course_module.findMany({
            include: {
                course: true,
                moduleContent: true
            }
        });
    },

    getCourseModuleById: async (id: string) => {
        return prisma.course_module.findUnique({
            where: { id },
            include: {
                course: true,
                moduleContent: true
            }
        });
    },

    updateCourseModule: async (id: string, data: Partial<UpdateCourseModuleBody>) => {
        return prisma.course_module.update({
            where: { id },
            data,
            include: {
                course: true
            }
        });
    },

    deleteCourseModule: async (id: string) => {
        return prisma.course_module.delete({
            where: { id }
        });
    },

    getModulesByCourseId: async (courseId: string) => {
        return prisma.course_module.findMany({
            where: { courseId },
            include: {
                moduleContent: true
            }
        });
    }
};
