import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import { signUpSchema, signInSchema, otpSchema, deleteByIdSchema } from '../zod/auth.schema';
import httpError from '../util/httpError';
import userServices from '../service/user.service';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import authServices from '../service/auth.service';
import emailService from '../service/email.service';
import * as jwt from 'jsonwebtoken';
import config from '../config';

export default {
    signUpStart: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = signInSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }
        const alreadyExist = await userServices.findbyEmail(result.data.email);

        if (alreadyExist && !alreadyExist.isDeleted) {
            return httpError(next, new Error(responseMessage.USER_ALREADY_EXIST), req, 409);
        }

        const otp = await authServices.createOtp(result.data.email);
        await emailService.sendOTP({ email: result.data.email, otp });

        return httpResponse(req, res, 201, responseMessage.SUCCESS, {});
    }),

    register: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = signUpSchema.safeParse(req.body);
        const otp = otpSchema.safeParse(req.query as { otp: string });

        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        if (!otp.success) {
            return httpError(next, new Error(quicker.zodError(otp)), req, 400);
        }

        const alreadyExist = await userServices.findbyEmail(result.data.email);
        const storedOtp = await authServices.verifyOtp(result.data.email, otp.data.otp);
        if (!storedOtp) {
            return httpError(next, new Error(responseMessage.INVALID_EXPIRED_OTP), req, 400);
        }
        let user;
        if (alreadyExist) {
            if (!alreadyExist.isDeleted) {
                return httpError(next, new Error(responseMessage.USER_ALREADY_EXIST), req, 409);
            }
            await userServices.restoreUser(alreadyExist.id);
        } else {
            user = await userServices.createUser({
                ...result.data
            });
        }

        const token = jwt.sign({ userId: user?.id, role: user?.role }, config.JWT_SECRET as string, {
            expiresIn: '24h'
        });
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { token });
    }),

    signIn: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = signInSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const user = await userServices.findbyEmail(result.data.email);
        if (!user || user.isDeleted) {
            return httpError(next, new Error('User not found'), req, 404);
        }

        const otp = await authServices.createOtp(result.data.email);
        await emailService.sendOTP({ email: result.data.email, otp });

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'OTP sent successfully' });
    }),

    verifyOtp: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body as { email: string };
        const result = signInSchema.safeParse({ email });
        const otp = otpSchema.safeParse(req.query as { otp: string });

        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        if (!otp.success) {
            return httpError(next, new Error(quicker.zodError(otp)), req, 400);
        }
        const user = await userServices.findbyEmail(email);
        if (!user) {
            return httpError(next, new Error('User not found'), req, 404);
        }

        const storedOtp = await authServices.verifyOtp(email, otp.data.otp);
        if (!storedOtp) {
            return httpError(next, new Error(responseMessage.INVALID_EXPIRED_OTP), req, 400);
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, config.JWT_SECRET as string, {
            expiresIn: '24h'
        });

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { token, user });
    }),

    markAsDeleted: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = deleteByIdSchema.safeParse({ id: Number(req.params.id) });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const user = await userServices.findById(result.data.id);
        if (!user) {
            return httpError(next, new Error('User not found'), req, 404);
        }
        await userServices.markAsDeleted(user.id);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'User deleted successfully' });
    })
};
