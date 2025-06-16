import prisma from '../lib/db';
import { SignUpBody, UpdateBody } from '../zod/auth.schema';

export default {
    findbyEmail: async (email: string) => {
        return await prisma.user.findFirst({
            where: { email }
        });
    },
    findById: async (id: number) => {
        return await prisma.user.findUnique({
            where: { id }
        });
    },
    createUser: async (data: SignUpBody) => {
        return await prisma.user.create({ data });
    },
    restoreUser: async (id: number) => {
        return await prisma.user.update({
            where: { id },
            data: { isDeleted: false }
        });
    },
    markAsDeleted: async (id: number) => {
        return await prisma.user.update({
            where: { id },
            data: { isDeleted: true }
        });
    },
    updateUser: async ({ id, data }: { id: number; data: UpdateBody }) => {
        return await prisma.user.update({
            where: { id },
            data
        });
    }
};
