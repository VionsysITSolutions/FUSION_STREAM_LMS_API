import { Router } from 'express';
import authController from '../controller/authController';

const authRouter = Router();
authRouter.route('/signup/start').post(authController.signUpStart);

export default authRouter;
