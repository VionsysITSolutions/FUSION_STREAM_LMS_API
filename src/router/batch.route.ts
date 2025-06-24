import { Router } from 'express';
import batchController from '../controller/batch.controller';
import authenticateUser from '../middleware/authenticate';

const batchRouter = Router();

// Batch Routes
batchRouter.route('/').post(authenticateUser('instructor', 'admin'), batchController.createBatch).get(batchController.getAllBatches);
batchRouter.route('/instructor/:id').post(authenticateUser('instructor', 'admin'), batchController.getBatchByInstructorId)
batchRouter
    .route('/:id')
    .get(batchController.getBatchById)
    .put(authenticateUser('instructor', 'admin'), batchController.updateBatch)
    .delete(batchController.deleteBatch);
batchRouter.route('/course/:courseId').get(batchController.getBatchesByCourse);

// Batch Enrollment Routes
batchRouter.route('/enroll').post(authenticateUser('student', 'instructor'), batchController.enrollStudent);
batchRouter.route('/unenroll').post(authenticateUser('instructor'), batchController.unenrollStudent);
batchRouter.route('/:batchId/students').get(batchController.getEnrolledStudents);
batchRouter.route('/notify-students').post(batchController.notifyStudentOnMessage);

export default batchRouter;
