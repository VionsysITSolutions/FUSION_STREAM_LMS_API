import { Router } from 'express';
import moduleContentController from '../controller/module-content.controller';

const moduleContentRouter = Router();

// Module Content Routes
moduleContentRouter.route('/').post(moduleContentController.createModuleContent).get(moduleContentController.getAllModuleContents);
moduleContentRouter
    .route('/:id')
    .get(moduleContentController.getModuleContentById)
    .put(moduleContentController.updateModuleContent)
    .delete(moduleContentController.deleteModuleContent);
moduleContentRouter.route('/module/:moduleId').get(moduleContentController.getContentByModule);

export default moduleContentRouter;
