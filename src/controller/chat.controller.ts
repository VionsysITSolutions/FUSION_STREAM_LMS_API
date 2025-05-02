import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import catchAsync from '../util/catchAsync';
import {
    createChatMessageSchema,
    updateChatMessageSchema,
    getChatMessageByIdSchema,
    getBatchChatMessagesSchema,
    getSessionChatMessagesSchema,
    replyChatMessageSchema
} from '../zod/chat.schema';
import httpError from '../util/httpError';
import quicker from '../util/quicker';
import responseMessage from '../constants/responseMessage';
import chatService from '../service/chat.service';

export default {
    createChatMessage: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = createChatMessageSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const message = await chatService.createChatMessage(result.data);
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { message });
    }),

    getAllChatMessages: catchAsync(async (req: Request, res: Response) => {
        const messages = await chatService.getAllChatMessages();
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { messages });
    }),

    getChatMessageById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getChatMessageByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const message = await chatService.getChatMessageById(result.data.id);
        if (!message) {
            return httpError(next, new Error('Chat message not found'), req, 404);
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message });
    }),

    updateChatMessage: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const idResult = getChatMessageByIdSchema.safeParse({ id: req.params.id });
        if (!idResult.success) {
            return httpError(next, new Error(quicker.zodError(idResult)), req, 400);
        }

        const dataResult = updateChatMessageSchema.safeParse(req.body);
        if (!dataResult.success) {
            return httpError(next, new Error(quicker.zodError(dataResult)), req, 400);
        }

        const existingMessage = await chatService.getChatMessageById(idResult.data.id);
        if (!existingMessage) {
            return httpError(next, new Error('Chat message not found'), req, 404);
        }

        const updatedMessage = await chatService.updateChatMessage(idResult.data.id, dataResult.data.messageTxt);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: updatedMessage });
    }),

    deleteChatMessage: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getChatMessageByIdSchema.safeParse({ id: req.params.id });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const existingMessage = await chatService.getChatMessageById(result.data.id);
        if (!existingMessage) {
            return httpError(next, new Error('Chat message not found'), req, 404);
        }

        await chatService.deleteChatMessage(result.data.id);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Chat message deleted successfully' });
    }),

    getBatchMessages: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getBatchChatMessagesSchema.safeParse({ batchId: req.params.batchId });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const messages = await chatService.getBatchMessages(result.data.batchId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { messages });
    }),

    getSessionMessages: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = getSessionChatMessagesSchema.safeParse({ batchSessionId: req.params.sessionId });
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const messages = await chatService.getSessionMessages(result.data.batchSessionId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { messages });
    }),

    getUserMessages: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;
        if (!userId || isNaN(Number(userId))) {
            return httpError(next, new Error('Valid user ID is required'), req, 400);
        }

        const messages = await chatService.getUserMessages(Number(userId));
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { messages });
    }),

    replyToMessage: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = replyChatMessageSchema.safeParse(req.body);
        if (!result.success) {
            return httpError(next, new Error(quicker.zodError(result)), req, 400);
        }

        const originalMessage = await chatService.getChatMessageById(result.data.replyToMessageId);
        if (!originalMessage) {
            return httpError(next, new Error('Original message not found'), req, 404);
        }

        const reply = await chatService.createChatMessage(result.data);
        return httpResponse(req, res, 201, responseMessage.SUCCESS, { reply });
    }),

    getMessageReplies: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const messageId = req.params.messageId;
        if (!messageId) {
            return httpError(next, new Error('Message ID is required'), req, 400);
        }

        const replies = await chatService.getReplies(messageId);
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { replies });
    })
};
