import { Router } from 'express';
import courseController from '../controller/course.controller';
import authenticateUser from '../middleware/authenticate';

const courseRouter = Router();

// Course Routes
courseRouter.route('/').post(authenticateUser('instructor'), courseController.createCourse).get(courseController.getAllCourses);
courseRouter.route('/approved').get(courseController.getApprovedCourses);
courseRouter
    .route('/:id')
    .get(courseController.getCourseById)
    .put(authenticateUser('instructor', 'admin'), courseController.updateCourse)
    .delete(authenticateUser('instructor', 'admin'), courseController.deleteCourse);
courseRouter.route('/approve/:id').post(authenticateUser('admin'), courseController.approveCourse);
courseRouter.route('/creator/:createdById').get(courseController.getCreatedCourses);

export default courseRouter;
