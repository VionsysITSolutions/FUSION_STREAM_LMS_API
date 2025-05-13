import { Router } from 'express';
import batchModuleController from '../controller/batch-module.controller';
import authenticateUser from '../middleware/authenticate';

const batchModuleRouter = Router();

// Batch Module Routes
batchModuleRouter
    .route('/')
    .post(authenticateUser('instructor','admin'), batchModuleController.createBatchModule)
    .get(batchModuleController.getAllBatchModules);
batchModuleRouter
    .route('/:id')
    .get(batchModuleController.getBatchModuleById)
    .put(authenticateUser('instructor','admin'), batchModuleController.updateBatchModule)
    .delete(authenticateUser('instructor','admin'), batchModuleController.deleteBatchModule);
batchModuleRouter.route('/batch/:batchId').get(batchModuleController.getModulesByBatch);
batchModuleRouter.route('/instructor/:instructorId').get(batchModuleController.getModulesByInstructor);

export default batchModuleRouter;
