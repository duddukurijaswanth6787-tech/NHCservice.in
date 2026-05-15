import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Generates a production-ready JWT.
 */
export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role || 'user' },
    config.jwtSecret,
    { expiresIn: '1d' }
  );
};
