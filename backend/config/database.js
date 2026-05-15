import mongoose from 'mongoose';
import { config } from './env.js';

/**
 * Establishes a production-ready MongoDB connection with retry logic.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      autoIndex: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Retry connection in production
    if (config.nodeEnv === 'production') {
      console.log('🔄 Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};
