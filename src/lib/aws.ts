import { SNSClient } from '@aws-sdk/client-sns';
import config from '../config';

if (!config.AWS_REGION || !config.AWS_ACCESS_KEY || !config.AWS_SECRET_KEY) throw new Error('AWS keys are required');

export const sns = new SNSClient({
    region: config.AWS_REGION,
    credentials: {
        // accessKeyId: "AKIA45Y2RP56HLT7N4XD",
        // secretAccessKey: "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",
        accessKeyId: config.AWS_ACCESS_KEY,
        secretAccessKey: config.AWS_SECRET_KEY
    }
});
