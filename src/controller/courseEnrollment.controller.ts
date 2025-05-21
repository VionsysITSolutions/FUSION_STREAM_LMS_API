import { NextFunction, Request, Response } from 'express';
import catchAsync from '../util/catchAsync';
import {
    CreateTransactionInput,
    batchEnrollmentSchema,
    checkLoggedInUserEnrolledInTheCourseBodySchema,
    createOrderSchema,
    getCourseOrBatchEnrollmentRequest
} from '../zod/courseEnrollment.schema';
import quicker from '../util/quicker';
import httpError from '../util/httpError';
import { Role } from '@prisma/client';
import razorpay from '../lib/razorpay';
import courseEnrollmentService from '../service/courseEnrollment.service';
import httpResponse from '../util/httpResponse';
import responseMessage from '../constants/responseMessage';
import crypto from 'crypto';

interface RequestWithUser extends Request {
    user?: {
        id: number;
        email: string;
        role: Role;
    };
    body: CreateTransactionInput;
}

export default {
    createOrder: catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        // Check if transaction already exists for this course & user
        const isEnrolled = await courseEnrollmentService.checkStudentEnrolledInTheCourse(Number(req.user?.id), req.body.courseId);
        if (isEnrolled) {
            return httpError(next, new Error('Your already enrolled in the course'), req, 400);
        }
        const amountDecimal = req.body.amount;
        const amount = parseInt(amountDecimal.toString());
        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                courseId: req.body.courseId,
                userId: String(req.user?.id),
                batchId: String(req.body.batchId)
            }
        });

        // Validate input
        const validation = createOrderSchema.safeParse({ ...req.body, userId: req.user?.id });
        if (!validation.success) {
            return httpError(next, new Error(quicker.zodError(validation)), req, 400);
        }

        // Create transaction (status: PENDING)
        const transaction = await courseEnrollmentService.createOrder({
            orderId: razorpayOrder.id,
            ...validation.data
        });

        return httpResponse(req, res, 200, responseMessage.SUCCESS, {
            orderId: razorpayOrder.id,
            amount: amount,
            transactionId: transaction.id
        });
    }),

    razorpayWebhook: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
        const razorpaySignature = req.headers['x-razorpay-signature'] as string;

        const body = JSON.stringify(req.body);
        const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');

        if (razorpaySignature !== expectedSignature) {
            return httpError(next, new Error('Invalid Razorpay webhook signature'), req, 400);
        }

        const event = req.body as unknown as {
            event?: string;
            payload?: {
                payment?: {
                    entity?: {
                        id?: string;
                        order_id?: string;
                        notes?: {
                            batchId?: string;
                        };
                    };
                };
            };
        };

        if (event.event === 'payment.captured') {
            const payment = event?.payload?.payment?.entity;

            if (!payment?.order_id || !payment?.id) {
                return httpError(next, new Error('Missing payment details'), req, 400);
            }

            const orderId = payment.order_id;
            const paymentId = payment.id;

            const transaction = await courseEnrollmentService.getTransactionByOrderId(orderId);
            if (!transaction) {
                return httpError(next, new Error('Transaction not found'), req, 404);
            }

            const updatedTransaction = await courseEnrollmentService.updateTransaction(orderId, paymentId);
            if (!updatedTransaction) {
                return httpError(next, new Error('Transaction update failed'), req, 500);
            }

            // Now enroll the student in course and batch
            const courseEnrollment = await courseEnrollmentService.createCourseEnrollment({
                userId: updatedTransaction.userId,
                courseId: updatedTransaction.courseId,
                transactionId: updatedTransaction.id
            });
            if (!courseEnrollment) {
                return httpError(next, new Error('Course enrollment failed'), req, 500);
            }

            const batchValidation = batchEnrollmentSchema.safeParse({
                studentId: updatedTransaction.userId,
                batchId: payment.notes?.batchId
            });

            if (!batchValidation.success) {
                return httpError(next, new Error(quicker.zodError(batchValidation)), req, 400);
            }

            const batchEnrollment = await courseEnrollmentService.createBatchEnrollment({
                userId: updatedTransaction.userId,
                batchId: batchValidation.data.batchId
            });

            if (!batchEnrollment) {
                return httpError(next, new Error('Batch enrollment failed'), req, 500);
            }
            return httpResponse(req, res, 200, 'Transaction updated successfully', {
                transactionId: updatedTransaction.id
            });
        }

        if (event.event === 'payment.failed') {
            const payment = event?.payload?.payment?.entity;
            if (!payment?.order_id || !payment?.id) {
                return httpError(next, new Error('Missing payment details for failed payment'), req, 400);
            }

            const orderId = payment.order_id;
            const paymentId = payment.id;

            const transaction = await courseEnrollmentService.getTransactionByOrderId(orderId);
            if (!transaction) {
                return httpError(next, new Error('Transaction not found for failed payment'), req, 404);
            }

            // Update the transaction with status = 'FAILED'
            const failedTransaction = await courseEnrollmentService.markTransactionFailed(orderId, paymentId);
            if (!failedTransaction) {
                return httpError(next, new Error('Failed to mark transaction as failed'), req, 500);
            }

            return httpResponse(req, res, 200, 'Payment failure handled, transaction marked as failed', {});
        }

        return httpResponse(req, res, 200, 'Webhook received, event not processed', {});
    }),

    deleteTransaction: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const transactionId = req.params.transactionId;
        const transaction = await courseEnrollmentService.getTransactionById(transactionId);
        if (!transaction) {
            return httpError(next, new Error('Transaction not found'), req, 404);
        }

        await courseEnrollmentService.deleteTransaction(transactionId);
        return httpResponse(req, res, 200, 'Transaction deleted successfully', {});
    }),

    getEnrolledCoursesByStudentId: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getCourseOrBatchEnrollmentRequest.safeParse({ studentId: req.user?.id });

        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const data = await courseEnrollmentService.getEnrolledCourses(result.data.studentId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, data);
    }),
    getStudentEnrolledBatches: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getCourseOrBatchEnrollmentRequest.safeParse({ studentId: req.user?.id });

        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }
        const data = await courseEnrollmentService.getEnrolledBatches(result.data.studentId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, data);
    }),

    getEnrolledBatchById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id) {
            httpError(next, new Error('id not found'), req, 400);
        }
        const data = await courseEnrollmentService.getBatchEnrollmentById(id);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, data);
    }),

    checkLoggedInUserEnrolledInTheCourse: catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const validation = checkLoggedInUserEnrolledInTheCourseBodySchema.safeParse({
            studentId: Number(req.user?.id),
            courseId: req.params.courseId
        });
        if (!validation.success) {
            return httpError(next, new Error(quicker.zodError(validation)), req, 400);
        }

        const isEnrolled = await courseEnrollmentService.checkStudentEnrolledInTheCourse(validation.data.studentId, validation.data.courseId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { isEnrolled });
    })
};
