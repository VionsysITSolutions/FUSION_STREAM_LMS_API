import application from '../constants/application';
import prisma from '../lib/db';
import redis from '../lib/redis';
import quicker from '../util/quicker';
export default {
    createOtp: async (email: string) => {
        const otp = quicker.generateOTP();
        const key = `otp:${email}`;
        await redis.set(key, otp, 'EX', application.OTP_EXPIRY);
        return otp;
    },

    verifyOtp: async (email: string, otp: string) => {
        const key = `otp:${email}`;
        const storedOtp = await redis.get(key);
        const result = storedOtp && storedOtp === otp;
        return result;
    },
    findUserById: async (id: number) => {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        return user;
    }
};
