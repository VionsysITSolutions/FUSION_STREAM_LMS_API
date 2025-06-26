import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import { signUpSchema, signInSchema, otpSchema, deleteByIdSchema, updateUserSchema, UserSchema } from '../zod/auth.schema';
import httpError from '../util/httpError';
import userServices from '../service/user.service';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import authServices from '../service/auth.service';
import emailService from '../service/email.service';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import userService from '../service/user.service';
import authService from '../service/auth.service';
// import userService from '../service/user.service';

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

        const token = jwt.sign({ userId: user?.id, role: user?.role, name: `${user?.firstName} ${user?.lastName}` }, config.JWT_SECRET as string, {
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
            return httpError(next, new Error('User not found or deleted'), req, 404);
        }

        if (user.status === 'blocked') {
            return httpError(next, new Error('You are blocked, please connect with Admin'), req, 404);
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

        const token = jwt.sign({ userId: user.id, role: user.role, name: `${user?.firstName} ${user?.lastName}` }, config.JWT_SECRET as string, {
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

        const loggedUserRole = req.user?.role;
        const targetRole = user.role;

        const rolePermissions: Record<string, string[]> = {
            superAdmin: ['admin', 'instructor', 'student'],
            admin: ['instructor', 'student'],
            instructor: ['student']
        };

        if (!loggedUserRole || !rolePermissions[loggedUserRole]?.includes(targetRole)) {
            return httpError(next, new Error('Not authorized to delete this user'), req, 403);
        }

        await userServices.markAsDeleted(user.id);

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'User deleted successfully' });
    }),

    getLoggedInUserById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || typeof req.user.id === 'undefined') {
            return httpError(next, new Error('User not authenticated'), req, 401);
        }
        const result = deleteByIdSchema.safeParse({ id: Number(req.user.id) });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }
        const savedUser = await userService.findById(result.data.id);
        if (!savedUser) {
            return httpError(next, new Error('User not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { user: savedUser });
    }),

    updateUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = updateUserSchema.safeParse(req.body);

        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        if (!req.user || typeof req.user.id === 'undefined') {
            return httpError(next, new Error('User not authenticated'), req, 401);
        }

        const userId = Number(req.user.id);

        const user = await userService.findById(userId);
        if (!user) {
            return httpError(next, new Error('User not found'), req, 404);
        }

        const updatedUser = await userService.updateUser({
            id: userId,
            data: result.data
        });

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { user: updatedUser });
    }),

    updateUserById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = updateUserSchema.safeParse(req.body);
        const userId = Number(req.params.id);
        const loggedUserRole = req.user?.role;

        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const user = await userService.findById(userId);
        if (!user) {
            return httpError(next, new Error('User not found'), req, 404);
        }

        // Role-based access control
        const targetRole = user.role;
        const rolePermissions: Record<string, string[]> = {
            superAdmin: ['admin', 'instructor', 'student'],
            admin: ['instructor', 'student'],
            instructor: ['student']
        };

        if (!loggedUserRole || !rolePermissions[loggedUserRole]?.includes(targetRole)) {
            return httpError(next, new Error('Not authorized to update this user'), req, 403);
        }

        const updatedUser = await userService.updateUser({
            id: userId,
            data: result.data
        });

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { user: updatedUser });
    }),

    createUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = UserSchema.safeParse(req.body);
        const userRole = req.user?.role

        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        if (userRole === 'admin' && (result.data.role === 'admin' || result.data.role === 'instructor')) {
            return httpError(next, new Error('Admin is not authorized to create Admin or Superadmin'), req, 400);
        }

        const alreadyExistUser = await userServices.findbyEmail(result.data.email)
        if (alreadyExistUser) {
            return httpError(next, new Error(`Email ${alreadyExistUser.email} already exist with role ${alreadyExistUser.role}`), req, 400);
        }

        const user = await userServices.createUser({ ...result.data, parentNumber: result.data.mobileNumber });
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { user });
    }),

    allUsers: catchAsync(async (req: Request, res: Response) => {
        const users = await authService.getAllUsers()
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { users });
    })
};
