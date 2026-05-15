
/**
 * Sends a message via Telegram Bot API
 * @param {string} message - The message text (Markdown supported)
 */
export async function sendTelegramMessage(message) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.warn('⚠️ Telegram credentials missing. Skipping notification.');
        return;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        if (!data.ok) {
            console.error('❌ Telegram API Error:', data.description);
        }
        return data;
    } catch (error) {
        console.error('❌ Telegram Connection Error:', error.message);
    }
}

/**
 * Automatically registers the webhook with Telegram
 */
export async function initTelegramWebhook() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

    if (!token || !webhookUrl) {
        console.warn('⚠️ Telegram Webhook skip: Missing token or URL');
        return;
    }

    const fullUrl = `${webhookUrl}/api/v1/telegram/webhook`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${fullUrl}`);
        const data = await response.json();
        
        if (data.ok) {
            console.log(`✅ Telegram Webhook Registered: ${fullUrl}`);
        } else {
            console.error(`❌ Telegram Webhook Registration Failed: ${data.description}`);
        }
    } catch (error) {
        console.error(`❌ Telegram Webhook Error: ${error.message}`);
    }
}

