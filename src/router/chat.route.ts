import { Router } from 'express';
import chatController from '../controller/chat.controller';

const chatRouter = Router();

// Chat Message Routes
chatRouter.route('/').post(chatController.createChatMessage).get(chatController.getAllChatMessages);
chatRouter.route('/:id').get(chatController.getChatMessageById).put(chatController.updateChatMessage).delete(chatController.deleteChatMessage);
chatRouter.route('/batch/:batchId').get(chatController.getBatchMessages);
chatRouter.route('/session/:sessionId').get(chatController.getSessionMessages);
chatRouter.route('/user/:userId').get(chatController.getUserMessages);
chatRouter.route('/reply').post(chatController.replyToMessage);
chatRouter.route('/replies/:messageId').get(chatController.getMessageReplies);

export default chatRouter;
