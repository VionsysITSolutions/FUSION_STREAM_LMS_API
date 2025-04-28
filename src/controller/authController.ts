import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import { signUpSchema } from '../zod/authSchema';
import httpError from '../util/httpError';
import userServices from '../service/userServices';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
// import authServices from '../service/authServices';

export default {
    signUpStart: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = signUpSchema.safeParse({ ...req.body });
        if (!result.success) return httpError(next, new Error(quicker.zodError(result)), req, 301);

        const alreadyExist = await userServices.findbyId(result?.data.email);
        if (alreadyExist) return httpError(next, new Error(responseMessage.USER_ALREADY_EXIST), req, 301);

        // authServices.createOtp(result?.data?.email)

        return httpResponse(req, res, 200, 'ok', {});
    })
};
