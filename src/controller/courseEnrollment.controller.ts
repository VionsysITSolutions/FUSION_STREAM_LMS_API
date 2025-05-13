import { NextFunction, Request, Response } from 'express';
import catchAsync from '../util/catchAsync';
import { CreateTransactionInput, batchEnrollmentSchema, createOrderSchema } from '../zod/courseEnrollment.schema';
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
        // check student is enrolled in the course
        const isEnrolled = await courseEnrollmentService.checkStudentEnrolledInTheCourse(Number(req.user?.id), req.body.courseId);
        if (isEnrolled) {
            return httpError(next, new Error('Student is already enrolled in the course'), req, 400);
        }
        // generate razorpay order id
        const razorpayOrder = await razorpay.orders.create({
            amount: req.body.amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                courseId: req.body.courseId,
                userId: Number(req.user?.id)
            }
        });
        // Validate the input
        const transactionValidationResult = createOrderSchema.safeParse({
            ...req.body,
            userId: req.user?.id
        });
        if (!transactionValidationResult.success) {
            return httpError(next, new Error(quicker.zodError(transactionValidationResult)), req, 400);
        }
        // Create the transaction
        const transaction = await courseEnrollmentService.createOrder({
            orderId: razorpayOrder.id,
            ...transactionValidationResult.data
        });

        // create course enrollment
        const courseEnrollment = await courseEnrollmentService.createCourseEnrollment(transaction);
        if (!courseEnrollment) {
            return httpError(next, new Error('Course enrollment not created'), req, 400);
        }

        // batch enrollment
        const batchEnrollmentValidationResult = batchEnrollmentSchema.safeParse({ studentId: req.user?.id, batchId: req.body.batchId });

        if (!batchEnrollmentValidationResult.success) {
            return httpError(next, new Error(quicker.zodError(batchEnrollmentValidationResult)), req, 400);
        }

        const batchEnrollment = await courseEnrollmentService.createBatchEnrollment({
            userId: transaction.userId,
            batchId: batchEnrollmentValidationResult.data.batchId
        });

        if (!batchEnrollment) {
            return httpError(next, new Error('Batch enrollment not created'), req, 400);
        }

        // Response
        httpResponse(req, res, 200, responseMessage.SUCCESS, { transaction });
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
    })
};
