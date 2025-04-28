import Redis from 'ioredis';
import config from '../config/config';

if (!config.REDIS_URL) throw new Error('Redis URL not provided, please provide!');

const redis = new Redis(config.REDIS_URL);
export default redis;
