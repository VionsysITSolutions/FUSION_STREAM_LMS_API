import { Router } from 'express';
import batchController from '../controller/batch.controller';

const batchRouter = Router();

// Batch Routes
batchRouter.route('/').post(batchController.createBatch).get(batchController.getAllBatches);
batchRouter.route('/:id').get(batchController.getBatchById).put(batchController.updateBatch).delete(batchController.deleteBatch);
batchRouter.route('/course/:courseId').get(batchController.getBatchesByCourse);

// Batch Enrollment Routes
batchRouter.route('/enroll').post(batchController.enrollStudent);
batchRouter.route('/unenroll').post(batchController.unenrollStudent);
batchRouter.route('/:batchId/students').get(batchController.getEnrolledStudents);

export default batchRouter;
