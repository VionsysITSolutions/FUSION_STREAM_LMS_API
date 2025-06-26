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

    updateBatchSessionRecording: async (callId: string, url: string) => {
        return prisma.batch_module_session.update({
            where: { meetLink: callId },
            data: { recordingURL: url }
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
                    gt: now
                }
            },
            include: {
                batchModule: {
                    include: {
                        batch: true
                    }
                }
            },
            orderBy: {
                sessionDate: 'desc'
            }
        });
    },

    getSessionsByMeetingId: async (callId: string) => {
        return prisma.batch_module_session.findFirst({
            where: { meetLink: callId }
        });
    },
    createOfflineAttendanceBatch: async (batchData: {
        studentId: number;
        instructorId: number;
        batchId: string;
        sessionId: string;
    }[]) => {
        return prisma.manual_student_attendance.createMany({
            data: batchData,
        });
    },

     getOfflineAttendanceByBatchId: async (batchId: string) => {
        return prisma.manual_student_attendance.findMany({
            where: { batchId },
            
        });
    },
};
