import { Request, Response } from 'express';
import catchAsync from '../util/catchAsync';
import httpResponse from '../util/httpResponse';
import responseMessage from '../constants/responseMessage';
import batchSessionService from '../service/batch-session.service';
import progressService from '../service/progress.service';

interface WebhookPayload {
    type: string;
    call_cid: string;
    call_recording: {
        url: string;
    };
    participant: {
        user: {
            id: string,
            name: string
        }
        joined_at: Date;
    }
}

export default {
    saveSessionRecording: catchAsync(async (req: Request, res: Response) => {
        const rawBody = req.body as WebhookPayload;
        const call_cid = rawBody?.call_cid
        const callId = call_cid?.split(':')[1]

        // webhook is recording is reday
        if (rawBody?.type === 'call.recording_ready') {
            const sessionUrl = rawBody?.call_recording?.url

            if (sessionUrl) {
                await batchSessionService.updateBatchSessionRecording(callId, sessionUrl)
            }
        }

        // webhook is if user joined the Live meeting then created attendence
        if (rawBody?.type === 'call.session_participant_joined') {
            const { participant } = rawBody

            const session = await batchSessionService.getSessionsByMeetingId(callId)

            if (!session) throw new Error('The joined call not found')

            await progressService.markSessionAttendance({
                attendanceType: 'live',
                isAttended: true,
                sessionId: session.id,
                studentId: Number(participant.user.id),
                attendedAt: participant.joined_at
            });
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, { data: 'Webhook processed successfully' });
    }),
};



// {
//     "type": "call.session_participant_joined",
//     "created_at": "2025-05-19T10:32:05.653992466Z",
//     "call_cid": "default:5ecdcf1a-3ab8-4fe2-8e8b-0711b282c515",
//     "session_id": "5aad12a5-9734-40f5-ba9d-7f18a5257cee",
//     "participant": {
//       "user": {
//         "id": "2",
//         "name": "Ravikant Waghmare",
//         "image": "",
//         "language": "",
//         "role": "user",
//         "teams": [],
//         "created_at": "2025-05-19T07:35:23.14629Z",
//         "updated_at": "2025-05-19T08:40:10.166245Z",
//         "banned": false,
//         "online": true,
//         "blocked_user_ids": [],
//         "shadow_banned": false,
//         "invisible": false
//       },
//       "user_session_id": "6d2d4b93-cb2e-494e-8bdb-460d351cc806",
//       "role": "user",
//       "joined_at": "2025-05-19T10:32:05.653976712Z"
//     }
//   }