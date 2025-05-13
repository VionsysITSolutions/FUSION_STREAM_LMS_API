import { Router } from 'express';
import courseEnrollmentController from '../controller/courseEnrollment.controller';
import authenticateUser from '../middleware/authenticate';

const courseEnrollmentRouter = Router();

courseEnrollmentRouter.route('/create-order').post(authenticateUser('student'), courseEnrollmentController.createOrder);
courseEnrollmentRouter.route('/webhook').post(authenticateUser(), courseEnrollmentController.razorpayWebhook);

export default courseEnrollmentRouter;
