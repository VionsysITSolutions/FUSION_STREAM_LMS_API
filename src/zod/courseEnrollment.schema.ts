import { paymentStatus } from '@prisma/client';
import { z } from 'zod';
export const createOrderSchema = z.object({
    amount: z.number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a number'
    }),
    courseId: z.string({
        required_error: 'Course ID is required'
    }),
    userId: z.number({
        required_error: 'User ID is required',
        invalid_type_error: 'User ID must be a number'
    }),
    couponId: z.string().optional(),
    batchId: z.string({
        required_error: 'Batch ID is required',
        invalid_type_error: 'Batch ID must be a string'
    })
});

export const updateTransactionSchema = z.object({
    paymentId: z.string({
        required_error: 'Payment ID is required'
    }),
    paymentStatus: z.enum([paymentStatus.completed, paymentStatus.failed], {
        required_error: 'Payment status is required'
    })
});

export const studentCourseEnrollmentSchema = z.object({
    studentId: z
        .number({
            required_error: 'Student ID is required',
            invalid_type_error: 'Student ID must be a number'
        })
        .int({ message: 'Student ID must be an integer' })
        .positive({ message: 'Student ID must be a positive integer' }),

    courseId: z
        .string({
            required_error: 'Course ID is required',
            invalid_type_error: 'Course ID must be a string'
        })
        .min(1, { message: 'Course ID must not be empty' })
});

export const batchEnrollmentSchema = z.object({
    studentId: z.number({
        required_error: 'Student ID is required',
        invalid_type_error: 'Student ID must be a number'
    }),
    batchId: z.string({
        required_error: 'Batch ID is required',
        invalid_type_error: 'Batch ID must be a string'
    })
});

export const paymentVerificationSchema = z.object({
    razorpay_order_id: z.string({
        required_error: 'Razorpay Order ID is required',
        invalid_type_error: 'Razorpay Order ID must be a string'
    }),
    razorpay_payment_id: z.string({
        required_error: 'Razorpay Payment ID is required',
        invalid_type_error: 'Razorpay Payment ID must be a string'
    }),
    razorpay_signature: z.string({
        required_error: 'Razorpay Signature is required',
        invalid_type_error: 'Razorpay Signature must be a string'
    })
});

export type batchEnrollmentSchema = z.infer<typeof batchEnrollmentSchema>;
export type StudentCourseInpput = z.infer<typeof studentCourseEnrollmentSchema>;
export type CreateTransactionInput = z.infer<typeof createOrderSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type PaymentVerificationInput = z.infer<typeof paymentVerificationSchema>;
