import logger from '../utils/logger.js';

/**
 * Global error handler middleware for Express.
 * Masks internal errors in production for security.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;
