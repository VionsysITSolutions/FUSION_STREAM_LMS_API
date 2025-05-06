import { Router } from 'express';
import assessmentController from '../controller/assessment.controller';
import authenticateUser from '../middleware/authenticate';

const assessmentRouter = Router();

// Assessment Routes
assessmentRouter.route('/').post(authenticateUser('instructor', 'admin'), assessmentController.createAssessment);

assessmentRouter.route('/:type/:id').get(assessmentController.getAssessmentById);

// Question Routes
assessmentRouter.route('/questions').post(authenticateUser('instructor', 'admin'), assessmentController.createQuestion);

assessmentRouter
    .route('/questions/:id')
    .put(authenticateUser('instructor', 'admin'), assessmentController.updateQuestion)
    .delete(authenticateUser('instructor', 'admin'), assessmentController.deleteQuestion);

assessmentRouter.route('/:type/:assessmentId/questions').get(assessmentController.getQuestionsByAssessment);

export default assessmentRouter;
