import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates critical environment variables for production readiness.
 */
const requiredEnv = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT'
];

export const validateEnv = () => {
  const missing = requiredEnv.filter(env => !process.env[env]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
  console.log('✅ Environment variables validated.');
};

export const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
  geminiApiKey: process.env.GEMINI_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramWebhookUrl: process.env.TELEGRAM_WEBHOOK_URL,
};

