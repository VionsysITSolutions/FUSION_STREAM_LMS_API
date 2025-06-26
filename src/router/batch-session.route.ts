import { Router } from 'express';
import batchSessionController from '../controller/batch-session.controller';
import authenticateUser from '../middleware/authenticate';

const batchSessionRouter = Router();

batchSessionRouter.route('/past').get(batchSessionController.getPastSessions);
batchSessionRouter.route('/upcoming').get(batchSessionController.getUpcomingSessions);
batchSessionRouter.route('/module/:moduleId').get(batchSessionController.getSessionsByModule);
// Batch Session Routes
batchSessionRouter
    .route('/')
    .post(authenticateUser('instructor', 'admin'), batchSessionController.createBatchSession)
    .get(batchSessionController.getAllBatchSessions);
batchSessionRouter
    .route('/:id')
    .get(batchSessionController.getBatchSessionById)
    .put(authenticateUser('instructor', 'admin'), batchSessionController.updateBatchSession)
    .delete(authenticateUser('instructor', 'admin'), batchSessionController.deleteBatchSession);

batchSessionRouter.route('/offline-attendance').post(authenticateUser('instructor'),batchSessionController.createOfflineAttendanceBatch)
batchSessionRouter.route('/get-offline-attendance/:batchId').get(batchSessionController.getAllOfflineAttendance);
export default batchSessionRouter;  
