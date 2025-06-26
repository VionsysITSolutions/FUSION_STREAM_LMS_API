import { Router } from 'express';
import batchMaterialController from '../controller/batch-material.controller';
import authenticateUser from '../middleware/authenticate';

const batchMaterialRouter = Router()

batchMaterialRouter.route('/').post(authenticateUser('instructor', 'admin'), batchMaterialController.addMaterial)

batchMaterialRouter.route('/instructor/:id').get(authenticateUser('instructor', 'admin'), batchMaterialController.getMaterialByInstructor)

batchMaterialRouter.route('/:id').delete(authenticateUser('instructor', 'admin'), batchMaterialController.deleteMaterial)
    .get(authenticateUser(), batchMaterialController.getMaterialByBatch)

export default batchMaterialRouter