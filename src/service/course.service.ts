import { PrismaClient } from '@prisma/client';
import { UpdateCourseBody } from '../types/types';

const prisma = new PrismaClient();

export default {
    createCourse: async (courseData: { name: string; description: string; category?: string; createdById: number }) => {
        console.log(courseData.createdById);
        return prisma.course.create({
            data: courseData,
            include: {
                createdBy: true
            }
        });
    },

    getAllCourses: async () => {
        return prisma.course.findMany({
            where: {
                isDeleted: false
            },
            include: {
                createdBy: true,
                approvedBy: true,
                courseModules: true
            }
        });
    },

    getCourseById: async (id: string) => {
        return prisma.course.findUnique({
            where: { id },
            include: {
                createdBy: true,
                approvedBy: true,
                courseModules: {
                    include: {
                        moduleContent: true
                    }
                },
                enrollments: {
                    include: {
                        student: true
                    }
                }
            }
        });
    },

    updateCourse: async (id: string, data: Partial<UpdateCourseBody>) => {
        return prisma.course.update({
            where: { id },
            data,
            include: {
                createdBy: true,
                approvedBy: true
            }
        });
    },

    deleteCourse: async (id: string) => {
        return prisma.course.update({
            where: { id },
            data: { isDeleted: true }
        });
    },

    approveCourse: async (id: string, approvedById: number) => {
        return prisma.course.update({
            where: { id },
            data: {
                isApproved: true,
                approvedById
            },
            include: {
                approvedBy: true
            }
        });
    },

    getCreatedCourses: async (createdById: number) => {
        return prisma.course.findMany({
            where: {
                createdById,
                isDeleted: false
            },
            include: {
                courseModules: true,
                enrollments: true
            }
        });
    },

    getApprovedCourses: async () => {
        return prisma.course.findMany({
            where: {
                isApproved: true,
                isDeleted: false
            },
            include: {
                courseModules: true,
                enrollments: true
            }
        });
    }
};
