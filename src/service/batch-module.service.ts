import { PrismaClient } from '@prisma/client';
import { UpdateBatchModuleBody } from '../types/types';

const prisma = new PrismaClient();

export default {
    createBatchModule: async (moduleData: { title: string; description: string; instructorId: number; batchId: string }) => {
        return prisma.batch_module.create({
            data: moduleData
        });
    },

    getAllBatchModules: async () => {
        return prisma.batch_module.findMany({
            include: {
                instructor: true,
                batch: true,
                batchModuleSessions: true
            }
        });
    },

    getBatchModuleById: async (id: string) => {
        return prisma.batch_module.findUnique({
            where: { id },
            include: {
                instructor: true,
                batch: true,
                batchModuleSessions: true
            }
        });
    },

    updateBatchModule: async (id: string, data: Partial<UpdateBatchModuleBody>) => {
        return prisma.batch_module.update({
            where: { id },
            data
        });
    },

    deleteBatchModule: async (id: string) => {
        return prisma.batch_module.delete({
            where: { id }
        });
    },

    getModulesByBatchId: async (batchId: string) => {
        return prisma.batch_module.findMany({
            where: { batchId },
            include: {
                instructor: true,
                batchModuleSessions: true
            }
        });
    },

    getModulesByInstructorId: async (instructorId: number) => {
        return prisma.batch_module.findMany({
            where: { instructorId },
            include: {
                batch: true,
                batchModuleSessions: true
            }
        });
    }
};
