import { Router } from 'express';
import batchSessionController from '../controller/batch-session.controller';

const batchSessionRouter = Router();

batchSessionRouter.route('/past').get(batchSessionController.getPastSessions);
batchSessionRouter.route('/upcoming').get(batchSessionController.getUpcomingSessions);
batchSessionRouter.route('/module/:moduleId').get(batchSessionController.getSessionsByModule);
// Batch Session Routes
batchSessionRouter.route('/').post(batchSessionController.createBatchSession).get(batchSessionController.getAllBatchSessions);
batchSessionRouter
    .route('/:id')
    .get(batchSessionController.getBatchSessionById)
    .put(batchSessionController.updateBatchSession)
    .delete(batchSessionController.deleteBatchSession);

export default batchSessionRouter;
