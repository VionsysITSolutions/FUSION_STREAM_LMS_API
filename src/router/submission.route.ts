import { Router } from 'express';
import submissionController from '../controller/submission.controller';
import authenticateUser from '../middleware/authenticate';

const submissionRouter = Router();

submissionRouter.route('/').post(authenticateUser('student'), submissionController.createSubmission);

submissionRouter.route('/:id').get(authenticateUser(), submissionController.getSubmissionById);

submissionRouter
    .route('/assessment/:type/:assessmentId')
    .get(authenticateUser('instructor', 'admin', 'student'), submissionController.getSubmissionsByAssessment);

submissionRouter
    .route('/assessment/student/:type/:assessmentId')
    .get(authenticateUser('student'), submissionController.getSubmissionsByAssessmentAndStudent);

submissionRouter.route('/student/:studentId').get(authenticateUser(), submissionController.getSubmissionsByStudent);

export default submissionRouter;
