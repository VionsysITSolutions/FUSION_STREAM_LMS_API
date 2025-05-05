import prisma from '../lib/db';
import { UpdateBatchSessionBody } from '../types/types';

export default {
    createBatchSession: async (sessionData: {
        topicName: string;
        summary: string;
        sessionDate: Date;
        meetLink: string;
        recordingURL?: string;
        batchModuleId: string;
    }) => {
        return prisma.batch_module_session.create({
            data: {
                ...sessionData,
                sessionDate: new Date(sessionData.sessionDate)
            }
        });
    },

    getAllBatchSessions: async () => {
        return prisma.batch_module_session.findMany({
            include: {
                batchModule: {
                    include: {
                        instructor: true,
                        batch: true
                    }
                }
            }
        });
    },

    getBatchSessionById: async (id: string) => {
        return prisma.batch_module_session.findUnique({
            where: { id },
            include: {
                batchModule: {
                    include: {
                        instructor: true,
                        batch: true
                    }
                },
                chatMessages: true
            }
        });
    },

    updateBatchSession: async (id: string, data: Partial<UpdateBatchSessionBody>) => {
        if (data.sessionDate) {
            data.sessionDate = new Date(data.sessionDate);
        }

        return prisma.batch_module_session.update({
            where: { id },
            data
        });
    },

    deleteBatchSession: async (id: string) => {
        return prisma.batch_module_session.delete({
            where: { id }
        });
    },

    getSessionsByModuleId: async (batchModuleId: string) => {
        return prisma.batch_module_session.findMany({
            where: { batchModuleId },
            include: {
                chatMessages: true
            }
        });
    },

    getPastSessions: async () => {
        const now = new Date();
        return prisma.batch_module_session.findMany({
            where: {
                sessionDate: {
                    lt: now
                }
            },
            include: {
                batchModule: {
                    include: {
                        instructor: true,
                        batch: true
                    }
                }
            }
        });
    },

    getUpcomingSessions: async () => {
        const now = new Date();
        return prisma.batch_module_session.findMany({
            where: {
                sessionDate: {
                    gte: now
                }
            },
            include: {
                batchModule: {
                    include: {
                        instructor: true,
                        batch: true
                    }
                }
            },
            orderBy: {
                sessionDate: 'asc'
            }
        });
    }
};
