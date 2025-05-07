import { z } from 'zod';

export const createChatMessageSchema = z.object({
    senderId: z
        .number({
            required_error: 'Sender ID is required',
            invalid_type_error: 'Sender ID must be a number'
        })
        .int({ message: 'Sender ID must be an integer' })
        .positive({ message: 'Sender ID must be a positive integer' }),

    batchId: z
        .string({
            required_error: 'Batch ID is required',
            invalid_type_error: 'Batch ID must be a string'
        })
        .min(1, { message: 'Batch ID must not be empty' }),

    messageTxt: z
        .string({
            required_error: 'Message text is required',
            invalid_type_error: 'Message text must be a string'
        })
        .min(1, { message: 'Message text must not be empty' }),

    replyToMessageId: z
        .string({
            invalid_type_error: 'Reply to message ID must be a string'
        })
        .optional(),

    batchSessionId: z
        .string({
            invalid_type_error: 'Batch session ID must be a string'
        })
        .optional()
});

export const updateChatMessageSchema = z.object({
    messageTxt: z
        .string({
            required_error: 'Message text is required',
            invalid_type_error: 'Message text must be a string'
        })
        .min(1, { message: 'Message text must not be empty' })
});

export const getChatMessageByIdSchema = z.object({
    id: z
        .string({
            required_error: 'Chat message ID is required',
            invalid_type_error: 'Chat message ID must be a string'
        })
        .min(1, { message: 'Chat message ID must not be empty' })
});

export const getBatchChatMessagesSchema = z.object({
    batchId: z
        .string({
            required_error: 'Batch ID is required',
            invalid_type_error: 'Batch ID must be a string'
        })
        .min(1, { message: 'Batch ID must not be empty' })
});

export const getSessionChatMessagesSchema = z.object({
    batchSessionId: z
        .string({
            required_error: 'Batch session ID is required',
            invalid_type_error: 'Batch session ID must be a string'
        })
        .min(1, { message: 'Batch session ID must not be empty' })
});

export const replyChatMessageSchema = z.object({
    senderId: z
        .number({
            required_error: 'Sender ID is required',
            invalid_type_error: 'Sender ID must be a number'
        })
        .int({ message: 'Sender ID must be an integer' })
        .positive({ message: 'Sender ID must be a positive integer' }),

    batchId: z
        .string({
            required_error: 'Batch ID is required',
            invalid_type_error: 'Batch ID must be a string'
        })
        .min(1, { message: 'Batch ID must not be empty' }),

    messageTxt: z
        .string({
            required_error: 'Message text is required',
            invalid_type_error: 'Message text must be a string'
        })
        .min(1, { message: 'Message text must not be empty' }),

    replyToMessageId: z
        .string({
            required_error: 'Reply to message ID is required',
            invalid_type_error: 'Reply to message ID must be a string'
        })
        .min(1, { message: 'Reply to message ID must not be empty' }),

    batchSessionId: z
        .string({
            invalid_type_error: 'Batch session ID must be a string'
        })
        .optional()
});
