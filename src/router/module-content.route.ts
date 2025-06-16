import { Router } from 'express';
import moduleContentController from '../controller/module-content.controller';
import authenticateUser from '../middleware/authenticate';

const moduleContentRouter = Router();

// Module Content Routes
moduleContentRouter
    .route('/')
    .post(authenticateUser('instructor'), moduleContentController.createModuleContent)
    .get(moduleContentController.getAllModuleContents);
moduleContentRouter
    .route('/:id')
    .get(moduleContentController.getModuleContentById)
    .put(authenticateUser('instructor', 'admin'), moduleContentController.updateModuleContent)
    .delete(authenticateUser('instructor', 'admin'), moduleContentController.deleteModuleContent);
moduleContentRouter.route('/module/:moduleId').get(moduleContentController.getContentByModule);

export default moduleContentRouter;
