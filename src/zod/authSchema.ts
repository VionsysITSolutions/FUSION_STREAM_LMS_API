import { z } from 'zod';

export const signUpSchema = z.object({
    firstName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Surname must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    mobileNumber: z
        .string()
        .min(10, { message: 'Phone number must be at least 10 digits' })
        .regex(/^\+?[0-9\s]+$/, { message: 'Please enter a valid phone number' }),
    gender: z.enum(['M', 'F', 'O'], {
        required_error: 'Please select your gender'
    })
});

export const signInSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' })
});

export const otpSchema = z.object({
    otp: z.string().min(6, { message: 'OTP must be 6 digits' }).max(6, { message: 'OTP must be 6 digits' })
});
