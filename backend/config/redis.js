import Redis from 'ioredis';
import { config } from './env.js';
import logger from '../utils/logger.js';

/**
 * Production-ready Redis client using ioredis.
 */
let redis = null;

if (config.redisUrl) {
  redis = new Redis(config.redisUrl, {
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  redis.on('connect', () => logger.info('✅ Redis Connected'));
  redis.on('error', (err) => logger.error(`❌ Redis Error: ${err.message}`));
} else {
  logger.warn('⚠️ REDIS_URL not set. Caching disabled.');
}

export default redis;
