import { Router } from 'express';
import batchModuleController from '../controller/batch-module.controller';

const batchModuleRouter = Router();

// Batch Module Routes
batchModuleRouter.route('/').post(batchModuleController.createBatchModule).get(batchModuleController.getAllBatchModules);
batchModuleRouter
    .route('/:id')
    .get(batchModuleController.getBatchModuleById)
    .put(batchModuleController.updateBatchModule)
    .delete(batchModuleController.deleteBatchModule);
batchModuleRouter.route('/batch/:batchId').get(batchModuleController.getModulesByBatch);
batchModuleRouter.route('/instructor/:instructorId').get(batchModuleController.getModulesByInstructor);

export default batchModuleRouter;
