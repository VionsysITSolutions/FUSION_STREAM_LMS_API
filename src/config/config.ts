import DotenvFlow from 'dotenv-flow';
DotenvFlow.config();
export default {
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
};
