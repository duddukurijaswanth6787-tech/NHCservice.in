import express from 'express';
import { processAiQuery } from '../utils/aiAgent.js';
import fetch from 'node-fetch';
import logger from '../utils/logger.js';

const router = express.Router();

// ==================== CONVERSATION MEMORY ====================
const conversationHistory = new Map();
const MAX_HISTORY = 20;

function addToHistory(chatId, role, content) {
    if (!conversationHistory.has(chatId)) {
        conversationHistory.set(chatId, []);
    }
    const history = conversationHistory.get(chatId);
    history.push({ role, content, timestamp: new Date().toISOString() });
    if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
}

function getHistory(chatId) {
    return conversationHistory.get(chatId) || [];
}

function clearHistory(chatId) {
    conversationHistory.delete(chatId);
}

/**
 * @route   POST /api/v1/telegram/webhook
 * @desc    Telegram Webhook Endpoint
 * @access  Public (Validated by Bot Token in URL if needed, or by chatId)
 */
router.post('/webhook', async (req, res) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const authorizedChatId = process.env.TELEGRAM_CHAT_ID;

    try {
        const update = req.body;
        logger.info('🤖 [TELEGRAM] Webhook hit');

        // Immediately acknowledge Telegram (must return 200)
        res.status(200).json({ ok: true });

        if (!update.message || !update.message.text) return;

        const message = update.message;
        const chatId = message.chat.id;
        const userId = message.from.id;
        const userText = message.text;

        // ✅ SECURITY: Validate Authorized Chat
        if (authorizedChatId && chatId.toString() !== authorizedChatId.toString()) {
            logger.warn(`⚠️ [TELEGRAM] Unauthorized access attempt from chat ID: ${chatId}`);
            await sendReply(token, chatId, "⛔ Access Denied. You are not authorized to use this bot.");
            return;
        }

        logger.info(`📩 Telegram Msg from ${userId}: ${userText}`);

        // Handle commands
        if (userText.startsWith('/')) {
            if (userText === '/start') {
                clearHistory(chatId);
                await sendReply(token, chatId, "Hello! I am your Cycle Harmony AI Assistant. 🤖\n\nAsk me anything about customers, orders, or inventory.\nType /clear to reset memory.");
            } else if (userText === '/clear') {
                clearHistory(chatId);
                await sendReply(token, chatId, "🧹 Conversation memory cleared!");
            }
            return;
        }

        // Show typing indicator
        await sendChatAction(token, chatId, 'typing');

        // Process with AI
        addToHistory(chatId, 'user', userText);
        const history = getHistory(chatId);
        const aiResponse = await processAiQuery(userText, history);
        addToHistory(chatId, 'assistant', aiResponse);

        // Send reply
        await sendReply(token, chatId, aiResponse);

    } catch (error) {
        logger.error(`❌ Telegram Webhook Error: ${error.message}`);
    }
});

/**
 * @route   GET /api/v1/telegram/test
 * @desc    Debug route to verify if the route is active
 */
router.get('/test', (req, res) => {
    res.status(200).json({ status: 'telegram route active', timestamp: new Date() });
});

// Helper: Send Message
async function sendReply(token, chatId, text) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
        });
        const data = await response.json();
        if (!data.ok && data.description?.includes('parse')) {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text })
            });
        }
    } catch (err) {
        logger.error(`❌ Failed to send Telegram reply: ${err.message}`);
    }
}

// Helper: Send Chat Action
async function sendChatAction(token, chatId, action) {
    return fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action })
    }).catch(err => logger.error('ChatAction Error:', err.message));
}

export default router;
