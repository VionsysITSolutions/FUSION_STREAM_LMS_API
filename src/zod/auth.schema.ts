import { z } from 'zod';

export const signUpSchema = z.object({
    firstName: z
        .string({
            required_error: 'First name is required',
            invalid_type_error: 'First name must be a string'
        })
        .min(2, { message: 'First name must be at least 2 characters' }),

    middleName: z.string().optional(),

    lastName: z
        .string({
            required_error: 'Last name is required',
            invalid_type_error: 'Last name must be a string'
        })
        .min(2, { message: 'Last name must be at least 2 characters' }),

    bio: z.string().optional(),

    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string'
        })
        .email({ message: 'Please enter a valid email address' }),

    university: z.string().optional(),

    parentNumber: z
        .string({
            required_error: 'Mobile number is required',
            invalid_type_error: 'Mobile number must be a string'
        })
        .min(10, { message: 'Mobile number must be at least 10 digits' })
        .regex(/^\+?[0-9\s]+$/, {
            message: 'Please enter a valid mobile number'
        }),

    mobileNumber: z
        .string({
            required_error: 'Mobile number is required',
            invalid_type_error: 'Mobile number must be a string'
        })
        .min(10, { message: 'Mobile number must be at least 10 digits' })
        .regex(/^\+?[0-9\s]+$/, {
            message: 'Please enter a valid mobile number'
        }),

    gender: z.enum(['M', 'F', 'O'], {
        required_error: 'Gender is required',
        invalid_type_error: 'Invalid gender selected'
    }),

    address: z.string().optional(),

    role: z
        .enum(['student', 'instructor', 'admin'], {
            invalid_type_error: 'Invalid role'
        })
        .optional()
});

export const signInSchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string'
        })
        .email({ message: 'Please enter a valid email address' })
});

export const otpSchema = z.object({
    otp: z
        .string({
            required_error: 'OTP is required',
            invalid_type_error: 'OTP must be a string'
        })
        .min(6, { message: 'OTP must be 6 digits' })
});

export const deleteByIdSchema = z.object({
    id: z
        .number({
            required_error: 'Id is required',
            invalid_type_error: 'Id must be a number'
        })
        .int({ message: 'Id must be an integer' })
        .positive({ message: 'Id must be a positive number' })
});

export const updateUserSchema = signUpSchema.partial();
export type UpdateBody = z.infer<typeof updateUserSchema>;
export type SignUpBody = z.infer<typeof signUpSchema>;
export type SignInBody = z.infer<typeof signInSchema>;
export type OtpBody = z.infer<typeof otpSchema>;
