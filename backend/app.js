import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config/env.js';
import { requestLogger } from './utils/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import { globalRateLimiter } from './middlewares/rateLimiter.js';

const app = express();

// Performance & Security Middlewares
app.use(compression());
app.use(helmet());
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10kb' })); // Body limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging & Rate Limiting
app.use(requestLogger);
app.use('/api', globalRateLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv
  });
});

app.get('/telegram/test', (req, res) => {
  res.status(200).json({ status: 'telegram route active' });
});


// Import Routes
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import telegramRoutes from './routes/telegramRoutes.js';

// API Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', customerRoutes);
app.use('/api/v1', ingredientRoutes);
app.use('/api/v1/telegram', telegramRoutes);



// Global Error Handler
app.use(errorHandler);

export default app;
