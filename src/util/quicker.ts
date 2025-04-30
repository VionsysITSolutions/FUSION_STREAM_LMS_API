import { SafeParseReturnType } from 'zod';
import nodemailer from 'nodemailer';
import config from '../config';
export default {
    zodError: (result: SafeParseReturnType<unknown, unknown>) => {
        const error = result?.error?.issues[0]?.message ?? 'Validation error';
        return error;
    },
    generateOTP: () => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    },
    emailTransporter: nodemailer.createTransport({
        host: config.SMTP_HOST as string,
        port: Number(config.SMTP_PORT) || 587,
        service: config.SMTP_SERVICE,
        auth: {
            user: config.SMTP_MAIL,
            pass: config.SMTP_PASSWORD
        }
    })
};
