import { Router } from 'express';
import userController from '../controller/user.controller';
import authenticateUser from '../middleware/authenticate';

const userRouter = Router();

userRouter.route('/create').post(authenticateUser('instructor', 'admin'), userController.create);
userRouter.route('/update').post(authenticateUser('instructor', 'admin'), userController.updateUser);
userRouter.route('/instructors').get(authenticateUser('admin'), userController.getAllInstructors)

export default userRouter;
