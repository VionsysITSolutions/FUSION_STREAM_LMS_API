import { Router } from 'express';
import progressController from '../controller/progress.controller';
import authenticateUser from '../middleware/authenticate';

const progressRouter = Router();

// Module Progress Routes
progressRouter.route('/module').post(authenticateUser('student'), progressController.updateModuleProgress);

progressRouter.route('/module/:studentId/:moduleId').get(authenticateUser(), progressController.getModuleProgress);

// Session Attendance Routes
progressRouter.route('/attendance').post(authenticateUser('student'), progressController.markSessionAttendance);

progressRouter.route('/attendance/:studentId/:sessionId').get(authenticateUser(), progressController.getSessionAttendance);

// Course Progress Routes
progressRouter.route('/course').post(authenticateUser('student'), progressController.updateCourseProgress);

progressRouter.route('/course/:studentId/:batchId').get(authenticateUser(), progressController.getCourseProgress);

// Overall Student Progress Route
progressRouter.route('/student/:studentId').get(authenticateUser(), progressController.getStudentProgress);

export default progressRouter;
