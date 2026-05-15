import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const setWebhook = async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const realUrl = "https://nhcservicein-production.up.railway.app/api/v1/telegram/webhook";

    console.log(`Setting webhook to: ${realUrl}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${realUrl}`);
        const data = await response.json();
        
        if (data.ok) {
            console.log('✅ Webhook successfully updated!');
            console.log(data);
        } else {
            console.error('❌ Failed to update webhook:', data.description);
        }
    } catch (error) {
        console.error('❌ Connection Error:', error.message);
    }
};

setWebhook();
