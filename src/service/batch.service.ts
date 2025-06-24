import { PublishCommand } from '@aws-sdk/client-sns';
import prisma from '../lib/db';
import { updateBatchBody } from '../types/types';
import { sns } from '../lib/aws';

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
        instructors: number[]
    }) => {
        return prisma.batch.create({
            data: {
                ...batchData,
                startDate: new Date(batchData.startDate),
                instructors: {
                    connect: batchData.instructors?.map((id: number) => ({ id }))
                }
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
                },
                instructors: true
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

    getBatchByInstructor: async (id: number) => {
        return prisma.batch.findMany({
            where: {
                instructors: {
                    some: { id }
                }
            },
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
            data: {
                ...data,
                 instructors: {
                    connect: data.instructors?.map((id: number) => ({ id }))
                }
            }
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
                },
                instructors: true
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
    },
    sendNotificationToStudentsSMS: async (batchData: {
        heading: string;
        description: string;
        batchId: string;
    }) => {

        const params = {
            Message: `Hi User
            ${batchData?.heading}
            ${batchData?.description}
            `,
            PhoneNumber: '+91 7498012116',
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    DataType: 'String',
                    StringValue: 'Fusion_',
                },
            },
        };
        const command = new PublishCommand(params);
        const result = await sns.send(command);

        // console.log(command);
        // console.log('------');
        // console.log(result);
        return result
    },
    getAllEnrolledStudentByBatchId:async (id:string)=>{
        const batchDetails = await prisma.batch.findUnique({
            where: { id },
            include: {
                batchEnrollments: {
                    include: { student: true }
                },
            }
        });
        return batchDetails;
    }
    
};
