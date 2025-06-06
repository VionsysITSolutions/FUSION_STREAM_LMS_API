import { Request, Response } from 'express';
import catchAsync from '../util/catchAsync';
import httpResponse from '../util/httpResponse';
import responseMessage from '../constants/responseMessage';
import batchSessionService from '../service/batch-session.service';
import progressService from '../service/progress.service';
import batchService from '../service/batch.service';
import webhookService from '../service/webhook.service';

interface WebhookPayload {
    type: string;
    call_cid: string;
    call_recording: {
        url: string;
    };
    participant: {
        user: {
            id: string;
            name: string;
        };
        joined_at: Date;
    };
}

export default {
    saveSessionRecording: catchAsync(async (req: Request, res: Response) => {
        const rawBody = req.body as WebhookPayload;
        const call_cid = rawBody?.call_cid;
        const callId = call_cid?.split(':')[1];

        // webhook is recording is reday
        if (rawBody?.type === 'call.recording_ready') {
            const sessionUrl = rawBody?.call_recording?.url;

            if (sessionUrl) {
                await batchSessionService.updateBatchSessionRecording(callId, sessionUrl);
            }
        }

        // webhook is if user joined the Live meeting then created attendence
        if (rawBody?.type === 'call.session_participant_joined') {
            const { participant } = rawBody;

            const session = await batchSessionService.getSessionsByMeetingId(callId);

            if (!session) throw new Error('The joined call not found');

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

    // TODO --  add this api route to https://cron-job.org/
    sessionReminder: catchAsync(async (req, res) => {
        const allBatches = await batchService.getAllBatches();
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
        oneHourFromNow.setSeconds(0, 0);

        for (const batch of allBatches) {
            const enrolledStudents = batch.batchEnrollments || [];
            if (enrolledStudents.length === 0) continue;

            for (const module of batch.batchModules || []) {
                for (const session of module.batchModuleSessions || []) {
                    const sessionDate = new Date(session.sessionDate);

                    const timeDiff = Math.abs(sessionDate.getTime() - oneHourFromNow.getTime());
                    if (timeDiff <= 60 * 1000) {
                        for (const enrollment of enrolledStudents) {
                            await webhookService.sendSessionReminderSMS({ student: enrollment.student, session, batch });
                        }
                    }
                }
            }
        }
        return httpResponse(req, res, 200, 'Session reminders processed', allBatches);
    })
};
