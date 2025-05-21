import prisma from '../lib/db';
import { ModuleProgressBody, SessionAttendanceBody, CourseProgressBody } from '../types/types';

export default {
    // Module Progress
    updateModuleProgress: async (data: ModuleProgressBody) => {
        const existing = await prisma.module_progress.findFirst({
            where: { studentId: data.studentId, moduleId: data.moduleId }
        });

        if (existing) {
            return prisma.module_progress.update({
                where: { id: existing.id },
                data: {
                    isCompleted: data.isCompleted,
                    completedAt: data.completedAt || new Date()
                },
                include: {
                    student: true,
                    module: true
                }
            });
        }

        return prisma.module_progress.create({
            data: {
                ...data,
                completedAt: data.completedAt || new Date()
            },
            include: {
                student: true,
                module: true
            }
        });
    },

    getModuleProgress: async (studentId: number, moduleId: string) => {
        return prisma.module_progress.findFirst({
            where: { studentId, moduleId },
            include: {
                student: true,
                module: true
            }
        });
    },

    // Session Attendance
    markSessionAttendance: async (data: SessionAttendanceBody) => {
        const existing = await prisma.session_attendance.findFirst({
            where: { studentId: data.studentId, sessionId: data.sessionId }
        });

        if (existing) {
            return prisma.session_attendance.update({
                where: { id: existing.id },
                data: {
                    attendanceType: data.attendanceType,
                    isAttended: data.isAttended,
                    attendedAt: data.attendedAt
                },
                include: {
                    student: true,
                    session: true
                }
            });
        }

        return prisma.session_attendance.create({
            data: {
                ...data,
                attendedAt: data.attendedAt
            },
            include: {
                student: true,
                session: true
            }
        });
    },

    getSessionAttendance: async (studentId: number) => {
        return prisma.session_attendance.findMany({
            where: { studentId },
            include: {
                student: true,
                session: true
            }
        });
    },

    // Course Progress
    updateCourseProgress: async (data: CourseProgressBody) => {
        const existing = await prisma.course_progress.findFirst({
            where: { studentId: data.studentId, batchId: data.batchId }
        });

        if (existing) {
            return prisma.course_progress.update({
                where: { id: existing.id },
                data: {
                    progrssPercent: data.progrssPercent,
                    isCompleted: data.isCompleted,
                    updatedAt: new Date()
                },
                include: {
                    student: true,
                    batch: true
                }
            });
        }

        return prisma.course_progress.create({
            data: {
                ...data,
                progrssPercent: data.progrssPercent,
                updatedAt: new Date()
            },
            include: {
                student: true,
                batch: true
            }
        });
    },

    getCourseProgress: async (studentId: number, batchId: string) => {
        return prisma.course_progress.findFirst({
            where: { studentId, batchId },
            include: {
                student: true,
                batch: true
            }
        });
    },

    getStudentProgress: async (studentId: number) => {
        const [moduleProgress, sessionAttendance, courseProgress] = await Promise.all([
            prisma.module_progress.findMany({
                where: { studentId },
                include: {
                    module: true
                }
            }),
            prisma.session_attendance.findMany({
                where: { studentId },
                include: {
                    session: true
                }
            }),
            prisma.course_progress.findMany({
                where: { studentId },
                include: {
                    batch: true
                }
            })
        ]);

        return {
            moduleProgress,
            sessionAttendance,
            courseProgress
        };
    }
};
