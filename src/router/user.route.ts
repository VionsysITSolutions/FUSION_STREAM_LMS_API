import { Router } from 'express';
import userController from '../controller/user.controller';

const userRouter = Router();

userRouter.route('/create').post(userController.create);
userRouter.route('/update').post(userController.updateUser);

export default userRouter;
