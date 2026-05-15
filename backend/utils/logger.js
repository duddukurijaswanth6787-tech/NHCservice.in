import winston from 'winston';

/**
 * Configures Winston for structured JSON logging in production and readable logs in development.
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production' 
      ? winston.format.json() 
      : winston.format.combine(winston.format.colorize(), winston.format.simple())
  ),
  defaultMeta: { service: 'nhcservice-backend' },
  transports: [
    new winston.transports.Console(),
    // Add file transports in production if needed
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

// Middleware for logging requests
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  next();
};

export default logger;
