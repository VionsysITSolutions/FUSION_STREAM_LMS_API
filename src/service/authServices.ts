import application from '../constants/application';
import redis from '../lib/redis';

function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export default {
    createOtp: async (email: string) => {
        const otp = generateOtp();
        const key = `otp:${email}`;
        return await redis.set(key, otp, 'EX', application.OTP_EXPIRY);
    },

    verifyOtp: async (email: string) => {
        const key = `otp:${email}`;
        const storedOtp = await redis.get(key);
        return storedOtp;
    }
};
