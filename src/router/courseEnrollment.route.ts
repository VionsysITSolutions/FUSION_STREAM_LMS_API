import { Router } from 'express';
import courseEnrollmentController from '../controller/courseEnrollment.controller';
import authenticateUser from '../middleware/authenticate';

const courseEnrollmentRouter = Router();

courseEnrollmentRouter.route('/create-order').post(authenticateUser('student'), courseEnrollmentController.createOrder);
courseEnrollmentRouter.route('/webhook').post(courseEnrollmentController.razorpayWebhook);
courseEnrollmentRouter.route('/:transactionId').delete(authenticateUser(), courseEnrollmentController.deleteTransaction);
courseEnrollmentRouter.route('/check-enrolled/:courseId').get(authenticateUser(), courseEnrollmentController.checkLoggedInUserEnrolledInTheCourse);
courseEnrollmentRouter.route('/').get(authenticateUser('student'), courseEnrollmentController.getEnrolledCoursesByStudentId);
courseEnrollmentRouter.route('/batches').get(authenticateUser(), courseEnrollmentController.getStudentEnrolledBatches);
courseEnrollmentRouter.route('/batches/:id').get(authenticateUser('student'), courseEnrollmentController.getEnrolledBatchById);
courseEnrollmentRouter.route('/transactions').get(courseEnrollmentController.getAllTransactions);
export default courseEnrollmentRouter;
