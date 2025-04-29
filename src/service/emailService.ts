import application from '../constants/application';
import quicker from '../util/quicker';

export default {
    sendOTP: async ({ email, otp }: { email: string; otp: string }) => {
        try {
            const subject = `${application.APP_NAME || 'LMS System'} - OTP Verification`;
            const html = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>OTP Verification</h2>
            <p>Your OTP for verification is:</p>
            <h3 style="color: #2c3e50;">${otp}</h3>
            <p>This OTP is valid for ${application.OTP_EXPIRY / 60 || 5} minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <br />
            <p>Thanks,<br/>${application.APP_NAME || 'Team'}</p>
          </div>
        `;
            await quicker.emailTransporter.sendMail({
                to: email,
                subject,
                html
            });
        } catch (error) {
            throw new Error('Error sending OTP email: ' + (error as Error).message);
        }
    }
};
