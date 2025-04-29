import { Router } from 'express';
import authController from '../controller/authController';

const authRouter = Router();
authRouter.route('/sign-up').post(authController.signUpStart);
authRouter.route('/sign-in').post(authController.signIn);
authRouter.route('/verify-otp').post(authController.verifyOtp);
authRouter.route('/delete/:id').delete(authController.markAsDeleted);
export default authRouter;
