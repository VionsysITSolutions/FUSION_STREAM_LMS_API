import { Router } from 'express';
import apiController from '../controller/apiController';

const apiRouter = Router();
apiRouter.route('/').get(apiController.get);

export default apiRouter;
