import { z } from 'zod';

export const signUpSchema = z.object({
    firstName: z.string({ message: 'firstName is required' }).min(2, { message: 'Name must be at least 2 characters' }),
    middleName: z.string().optional(),
    lastName: z.string().min(2, { message: 'Surname must be at least 2 characters' }),
    bio: z.string().optional(),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    university: z.string().optional(),
    stream: z.string().optional(),
    mobileNumber: z
        .string()
        .min(10, { message: 'Phone number must be at least 10 digits' })
        .regex(/^\+?[0-9\s]+$/, { message: 'Please enter a valid phone number' }),
    gender: z.enum(['M', 'F', 'O'], {
        required_error: 'Please select your gender'
    }),
    address: z.string().optional(),
    role: z.enum(['student', 'instructor', 'admin']).optional()
});

export const signInSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' })
});

export const otpSchema = z.object({
    otp: z.string().min(6, { message: 'OTP must be 6 digits' }).max(6, { message: 'OTP must be 6 digits' })
});

export const deleteByIdSchema = z.object({
    id: z.number().int({ message: 'Id must be an integer' }).positive({ message: 'Id must be a positive number' })
});

export type SignUpBody = z.infer<typeof signUpSchema>;
export type SignInBody = z.infer<typeof signInSchema>;
export type OtpBody = z.infer<typeof otpSchema>;
