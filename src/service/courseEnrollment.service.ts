import { paymentStatus } from '@prisma/client';
import prisma from '../lib/db';

export default {
    checkStudentEnrolledInTheCourse: async (studentId: number, courseId: string) => {
        const isEnrolled = await prisma.courseEnrollment.findFirst({
            where: {
                studentId,
                courseId
            }
        });
        return isEnrolled;
    },

    getEnrolledCourses: async (studentId: number) => {
        const courseEnrolled = await prisma.courseEnrollment.findMany({
            where: {
                studentId: studentId
            }
        });

        return courseEnrolled;
    },

    createOrder: async (order: {
        orderId: string;
        userId: number;
        courseId: string;
        amount: number;
        paymentStatus?: paymentStatus;
        couponId?: string;
    }) => {
        const createdTransaction = await prisma.transaction.create({
            data: {
                orderId: order.orderId,
                userId: order.userId,
                courseId: order.courseId,
                amount: order.amount,
                paymentStatus: order.paymentStatus ?? 'pending',
                couponId: order.couponId ?? null
            }
        });

        return createdTransaction;
    },
    getTransactionByOrderId: async (orderId: string) => {
        const transaction = await prisma.transaction.findUnique({
            where: {
                orderId: orderId
            }
        });
        return transaction;
    },
    updateTransaction: async (razorpay_order_id: string, razorpay_payment_id: string) => {
        const updatedTransaction = await prisma.transaction.update({
            where: {
                orderId: razorpay_order_id
            },
            data: {
                paymentStatus: paymentStatus.completed,
                paymentId: razorpay_payment_id
            }
        });
        return updatedTransaction;
    },
    createCourseEnrollment: async (transaction: { userId: number; courseId: string; transactionId: string }) => {
        const enrollment = await prisma.courseEnrollment.create({
            data: {
                studentId: transaction.userId,
                courseId: transaction.courseId,
                transactionId: transaction.transactionId
            },
            include: {
                transaction: {
                    select: {
                        paymentStatus: true
                    }
                }
            }
        });
        return enrollment;
    },
    createBatchEnrollment: async (transaction: { userId: number; batchId: string }) => {
        const batchEnrollment = await prisma.batchEnrollment.create({
            data: {
                studentId: transaction.userId,
                batchId: transaction.batchId
            }
        });
        return batchEnrollment;
    },
    markTransactionFailed: async (orderId: string, paymentId: string) => {
        const failedTransaction = await prisma.transaction.update({
            where: { orderId },
            data: {
                paymentStatus: paymentStatus.failed,
                paymentId
            }
        });
        return failedTransaction;
    },
    getTransactionById: async (transactionId: string) => {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: transactionId
            }
        });
        return transaction;
    },
    deleteTransaction: async (transactionId: string) => {
        const deletedTransaction = await prisma.transaction.delete({
            where: {
                id: transactionId
            }
        });
        return deletedTransaction;
    }
};
