import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    process.env.NODE_ENV !== 'production' ? colorize() : winston.format.uncolorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console()
  ],
});

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Mask sensitive data in body
  const bodyToLog = { ...req.body };
  if (bodyToLog.password) bodyToLog.password = '***';
  if (bodyToLog.token) bodyToLog.token = '***';

  // Mask sensitive headers
  const headersToLog = { ...req.headers };
  if (headersToLog.authorization) headersToLog.authorization = '***';

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`[${req.method}] ${req.originalUrl}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
      params: req.params,
      query: req.query,
      body: bodyToLog,
      headers: headersToLog,
    });
  });

  next();
};

export default logger;
