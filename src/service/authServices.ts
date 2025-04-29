import application from '../constants/application';
import redis from '../lib/redis';
import quicker from '../util/quicker';
export default {
    createOtp: async (email: string) => {
        const otp = quicker.generateOTP();
        const key = `otp:${email}`;
        await redis.set(key, otp, 'EX', application.OTP_EXPIRY);
        return otp;
    },

    verifyOtp: async (email: string) => {
        const key = `otp:${email}`;
        const storedOtp = await redis.get(key);
        return storedOtp;
    }
};
