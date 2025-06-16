import prisma from '../lib/db';

export default {
    createChatMessage: async (messageData: {
        senderId: number;
        batchId: string;
        messageTxt: string;
        replyToMessageId?: string;
        batchSessionId?: string;
    }) => {
        return prisma.chat_message.create({
            data: messageData
        });
    },

    getAllChatMessages: async () => {
        return prisma.chat_message.findMany({
            include: {
                sender: true,
                batch: true,
                batchSession: true,
                replyToMessage: true,
                replies: true
            }
        });
    },

    getChatMessageById: async (id: string) => {
        return prisma.chat_message.findUnique({
            where: { id },
            include: {
                sender: true,
                batch: true,
                batchSession: true,
                replyToMessage: true,
                replies: true
            }
        });
    },

    updateChatMessage: async (id: string, messageTxt: string) => {
        return prisma.chat_message.update({
            where: { id },
            data: { messageTxt }
        });
    },

    deleteChatMessage: async (id: string) => {
        return prisma.chat_message.delete({
            where: { id }
        });
    },

    getBatchMessages: async (batchId: string) => {
        return prisma.chat_message.findMany({
            where: {
                batchId,
                batchSessionId: null
            },
            include: {
                sender: true,
                replies: {
                    include: {
                        sender: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },

    getSessionMessages: async (batchSessionId: string) => {
        return prisma.chat_message.findMany({
            where: { batchSessionId },
            include: {
                sender: true,
                replies: {
                    include: {
                        sender: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },

    getUserMessages: async (senderId: number) => {
        return prisma.chat_message.findMany({
            where: { senderId },
            include: {
                batch: true,
                batchSession: true,
                replies: true
            }
        });
    },

    getReplies: async (messageId: string) => {
        return prisma.chat_message.findMany({
            where: { replyToMessageId: messageId },
            include: {
                sender: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
    }
};
