import { sendEmail } from './utils/email.js';
import dotenv from 'dotenv';
dotenv.config();

const testEmail = async () => {
    console.log('Starting Email Test...');
    console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
    
    const result = await sendEmail({
        to: process.env.EMAIL_USER, // Send to self
        subject: 'NHCservice Email Test',
        html: '<h1>Email System Working!</h1><p>This is a test email from the NHCservice backend to verify your SMTP configuration.</p>'
    });

    if (result.success) {
        if (result.simulated) {
            console.log('✅ Email logic is running, but in SIMULATION mode (no credentials).');
        } else {
            console.log('✅ Email SENT successfully! Check your inbox at:', process.env.EMAIL_USER);
        }
    } else {
        console.error('❌ Email FAILED:', result.error);
    }
    
    process.exit(0);
};

testEmail();
