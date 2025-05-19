import { Router } from 'express';
import courseEnrollmentController from '../controller/courseEnrollment.controller';
import authenticateUser from '../middleware/authenticate';

const courseEnrollmentRouter = Router();

courseEnrollmentRouter.route('/create-order').post(authenticateUser('student'), courseEnrollmentController.createOrder);
courseEnrollmentRouter.route('/webhook').post(courseEnrollmentController.razorpayWebhook);
courseEnrollmentRouter.route('/:transactionId').delete(authenticateUser(), courseEnrollmentController.deleteTransaction);
courseEnrollmentRouter.route('/check-enrolled/:courseId').get(authenticateUser(), courseEnrollmentController.checkLoggedInUserEnrolledInTheCourse);
export default courseEnrollmentRouter;
