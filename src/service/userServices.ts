import prisma from '../lib/db';

export default {
    findbyId: async (email: string) => {
        return await prisma.user.findUnique({
            where: { email }
        });
    }
};
