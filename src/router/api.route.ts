import { Router } from 'express';
import apiController from '../controller/api.controller';

const apiRouter = Router();
apiRouter.route('/').get(apiController.get);

export default apiRouter;
