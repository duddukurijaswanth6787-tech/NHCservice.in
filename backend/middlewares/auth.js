import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Middleware to verify JWT and attach user to request.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Auth failed: ${error.message}`);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

/**
 * Middleware for Role-Based Access Control (RBAC).
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }
    next();
  };
};
