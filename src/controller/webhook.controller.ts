import { Request, Response } from 'express';
import catchAsync from '../util/catchAsync';
import httpResponse from '../util/httpResponse';
import responseMessage from '../constants/responseMessage';
import batchSessionService from '../service/batch-session.service';

interface WebhookPayload {
    type: string;
    call_cid?: string;
    call_recording?: {
        url: string;
    };
}

export default {
    saveSessionRecording: catchAsync(async (req: Request, res: Response) => {
        const rawBody = req.body as WebhookPayload;

        if (rawBody?.type === 'call.recording_ready') {
            const call_cid = rawBody?.call_cid
            const sessionUrl = rawBody?.call_recording?.url
            const callId = call_cid?.split(':')[1]

            if (callId && sessionUrl) {
                await batchSessionService.updateBatchSessionRecording(callId, sessionUrl)
            }
        }
        return httpResponse(req, res, 200, responseMessage.SUCCESS, { data: 'Webhook processed successfully' });
    }),
};
