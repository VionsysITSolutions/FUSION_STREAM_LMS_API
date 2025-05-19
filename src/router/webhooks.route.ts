import { Router } from 'express';
import webhookController from '../controller/webhook.controller';

const webhookRouter = Router()

webhookRouter.route('/recording').post(webhookController.saveSessionRecording)

export default webhookRouter