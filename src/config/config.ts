import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
export default {
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL
};
