import { Router } from 'express';
import authController from '../controller/auth.controller';
import authenticateUser from '../middleware/authenticate';

const authRouter = Router();
authRouter.route('/sign-up').post(authController.signUpStart);
authRouter.route('/register').post(authController.register);
authRouter.route('/sign-in').post(authController.signIn);
authRouter.route('/verify-otp').post(authController.verifyOtp);
authRouter.route('/delete/:id').delete(authenticateUser('admin', 'superadmin'), authController.markAsDeleted);
authRouter.route('/get-user').get(authenticateUser(), authController.getLoggedInUserById);
authRouter.route('/update-user').put(authenticateUser(), authController.updateUser);
authRouter.route('/update-user/:id').put(authenticateUser('admin', 'superadmin'), authController.updateUserById);
authRouter.route('/create-user').post(authenticateUser('admin', 'superadmin'), authController.createUser);
authRouter.route('/users').get(authenticateUser(), authController.allUsers);

export default authRouter;
