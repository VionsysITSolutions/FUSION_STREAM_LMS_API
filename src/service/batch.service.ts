import prisma from '../lib/db';
import { updateBatchBody } from '../types/types';

export default {
    // Batch Services
    createBatch: async (batchData: {
        name: string;
        description: string;
        startDate: Date;
        capacity: number;
        duration: number;
        batchTimeSlot: 'morning' | 'afternoon' | 'evening';
        courseId: string;
    }) => {
        return prisma.batch.create({
            data: {
                ...batchData,
                startDate: new Date(batchData.startDate)
            }
        });
    },

    getAllBatches: async () => {
        return prisma.batch.findMany({
            include: {
                course: {
                    include: {
                        createdBy: true
                    }
                },
                batchModules: {
                    include: {
                        batchModuleSessions: true
                    }
                },
                batchEnrollments: {
                    include: {
                        student: true
                    }
                }

            }
        });
    },

    getBatchById: async (id: string) => {
        return prisma.batch.findUnique({
            where: { id },
            include: {
                batchModules: {
                    include: {
                        batchModuleSessions: {
                            include: {
                                sessionAttendance: true
                            }
                        }
                    }
                },
                batchEnrollments: {
                    include: { student: true }
                },
                instructors: true

            }
        });
    },

    updateBatch: async (id: string, data: Partial<updateBatchBody>) => {
        if (data.startDate) {
            data.startDate = new Date(data.startDate);
        }

        return prisma.batch.update({
            where: { id },
            data
        });
    },

    deleteBatch: async (id: string) => {
        return prisma.batch.delete({
            where: { id }
        });
    },

    getBatchesByCourseId: async (courseId: string) => {
        return prisma.batch.findMany({
            where: { courseId },
            include: {
                batchModules: true,
                batchEnrollments: true
            }
        });
    },

    // Batch Enrollment Services
    enrollStudentInBatch: async (batchId: string, studentId: number) => {
        return prisma.batchEnrollment.create({
            data: {
                batchId,
                studentId
            }
        });
    },

    getStudentsInBatch: async (batchId: string) => {
        return prisma.batchEnrollment.findMany({
            where: { batchId },
            include: {
                student: true
            }
        });
    },

    unenrollStudentFromBatch: async (batchId: string, studentId: number) => {
        return prisma.batchEnrollment.deleteMany({
            where: {
                batchId,
                studentId
            }
        });
    }
};
