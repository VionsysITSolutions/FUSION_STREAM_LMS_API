import { PrismaClient } from '@prisma/client';
import { UpdateModuleContentBody } from '../types/types';

const prisma = new PrismaClient();

export default {
    createModuleContent: async (contentData: { name: string; description?: string; mediaUrl: string; moduleId: string }) => {
        return prisma.course_module_content.create({
            data: contentData,
            include: {
                module: true
            }
        });
    },

    // optional
    getAllModuleContents: async () => {
        return prisma.course_module_content.findMany({
            include: {
                module: {
                    include: {
                        course: true
                    }
                }
            }
        });
    },

    getModuleContentById: async (id: string) => {
        return prisma.course_module_content.findUnique({
            where: { id },
            include: {
                module: {
                    include: {
                        course: true
                    }
                }
            }
        });
    },

    updateModuleContent: async (id: string, data: Partial<UpdateModuleContentBody>) => {
        return prisma.course_module_content.update({
            where: { id },
            data,
            include: {
                module: true
            }
        });
    },

    deleteModuleContent: async (id: string) => {
        return prisma.course_module_content.delete({
            where: { id }
        });
    },

    getContentByModuleId: async (moduleId: string) => {
        return prisma.course_module_content.findMany({
            where: { moduleId }
        });
    }
};
