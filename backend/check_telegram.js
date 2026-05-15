import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const checkWebhook = async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        console.error('❌ TELEGRAM_BOT_TOKEN missing');
        process.exit(1);
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
        const data = await response.json();
        
        console.log('🤖 [TELEGRAM] Webhook Info:');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.ok && data.result.url) {
            console.log('\n✅ Webhook is registered at:', data.result.url);
        } else {
            console.log('\n⚠️ No webhook registered.');
        }
    } catch (error) {
        console.error('❌ Error checking webhook:', error.message);
    }
};

checkWebhook();
