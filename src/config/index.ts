import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
export default {
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SERVICE: process.env.SMTP_SERVICE,
    SMTP_MAIL: process.env.SMTP_MAIL,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    STREAM_API_KEY: process.env.STREAM_API_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACESSS_KEY: process.env.AWS_ACESSS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY

};
