import { PublishCommand } from '@aws-sdk/client-sns';
import { sns } from '../lib/aws';
import quicker from '../util/quicker';
import { batch, batch_module_session, User } from '@prisma/client';

interface SessionReminder {
    student: User,
    session: batch_module_session,
    batch: batch
}

export default {

    sendSessionReminderSMS: async ({ student, session, batch }: SessionReminder) => {

        const { formattedDate, formattedTime } = quicker;

        const message = `
      Dear ${student.firstName},
      
      Reminder: Your session "${session.topicName}" for batch "${batch.name}" is starting in 1 hour on ${formattedDate(session.sessionDate)} at ${formattedTime(session.sessionDate)}.
      
      Best regards,
      Fusion Software Institute Team
          `.trim();

        // for testing purpose
        // await quicker.emailTransporter.sendMail({
        //     to: student.email,
        //     subject: 'session reminder',
        //     text: message,
        // });

        const params = {
            Message: message,
            PhoneNumber: student.mobileNumber,
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    DataType: 'String',
                    StringValue: 'Fusion_',
                },
            },
        };

        const command = new PublishCommand(params);
        const result = await sns.send(command);
        return result;
    },


}