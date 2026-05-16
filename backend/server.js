import app from './app.js';
import { config, validateEnv } from './config/env.js';
import { connectDB } from './config/database.js';
import logger from './utils/logger.js';
import { initTelegramWebhook } from './utils/telegram.js';

/**
 * Initializes and starts the production server.
 */
const startServer = async () => {
  try {
    // 1. Validate Environment
    validateEnv();

    // 2. Connect Database
    await connectDB();
     app.get("/", (req, res) => {
  res.send("NHCService Backend Running Successfully");
   });
    // 3. Start Listening
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
      logger.info(`🌐 Health check: http://localhost:${config.port}/health`);
      initTelegramWebhook();
    });

    // 4. Handle Graceful Shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Process terminated.');
      });
    });

  } catch (error) {
    logger.error(`❌ Server Initialization Failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
