import { z } from 'zod';

export const createChatMessageSchema = z.object({
    senderId: z.number().int().positive('Sender ID must be a positive integer'),
    batchId: z.string().min(1, 'Batch ID is required'),
    messageTxt: z.string().min(1, 'Message text is required'),
    replyToMessageId: z.string().optional(),
    batchSessionId: z.string().optional()
});

export const updateChatMessageSchema = z.object({
    messageTxt: z.string().min(1, 'Message text is required')
});

export const getChatMessageByIdSchema = z.object({
    id: z.string().min(1, 'Chat message ID is required')
});

export const getBatchChatMessagesSchema = z.object({
    batchId: z.string().min(1, 'Batch ID is required')
});

export const getSessionChatMessagesSchema = z.object({
    batchSessionId: z.string().min(1, 'Batch session ID is required')
});

export const replyChatMessageSchema = z.object({
    senderId: z.number().int().positive('Sender ID must be a positive integer'),
    batchId: z.string().min(1, 'Batch ID is required'),
    messageTxt: z.string().min(1, 'Message text is required'),
    replyToMessageId: z.string().min(1, 'Reply to message ID is required'),
    batchSessionId: z.string().optional()
});
