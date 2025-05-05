import { Router } from 'express';
import courseModuleController from '../controller/course-module.controller';
import authenticateUser from '../middleware/authenticate';

const courseModuleRouter = Router();

courseModuleRouter.route('/course/:courseId').get(courseModuleController.getModulesByCourse);

// Course Module Routes
courseModuleRouter
    .route('/')
    .post(authenticateUser('instructor'), courseModuleController.createCourseModule)
    .get(courseModuleController.getAllCourseModules);

courseModuleRouter
    .route('/:id')
    .get(courseModuleController.getCourseModuleById)
    .put(authenticateUser('instructor', 'admin'), courseModuleController.updateCourseModule)
    .delete(authenticateUser('instructor', 'admin'), courseModuleController.deleteCourseModule);

export default courseModuleRouter;
