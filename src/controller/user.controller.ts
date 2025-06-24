import { NextFunction, Request, Response } from 'express';
import catchAsync from '../util/catchAsync';
import httpResponse from '../util/httpResponse';
import responseMessage from '../constants/responseMessage';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import userService from '../service/user.service';
import { deleteByIdSchema, signUpSchema, updateUserSchema } from '../zod/auth.schema';

export default {
    create: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = signUpSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const alreadyExistingUser = await userService.findbyEmail(result.data.email);
        if (alreadyExistingUser) {
            return httpError(next, new Error(responseMessage.USER_ALREADY_EXIST), req, 400);
        }

        const NewUser = await userService.createUser(result.data);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { NewUser });
    }),

    updateUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = updateUserSchema.safeParse(req.body);
        const idResult = deleteByIdSchema.safeParse({ id: Number(req.params.id) });
        if (!result.success || !idResult.success) {
            return httpError(next, new Error(quicker.zodError(result || idResult)), req, 400);
        }
        const ExistingUser = await userService.findById(idResult.data.id);
        if (ExistingUser) {
            return httpError(next, new Error(responseMessage.NOT_FOUND('User')), req, 400);
        }

        const updatedUser = await userService.updateUser({ id: idResult.data.id, data: result.data });
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { updatedUser });
    }),

    getAllInstructors: catchAsync(async (req: Request, res: Response) => {
        const instructors = await userService.getInstuctors()
        console.log(instructors)
        return httpResponse(req, res, 200, responseMessage.SUCCESS, instructors);
    })
};
