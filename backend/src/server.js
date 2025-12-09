import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import brandsRouter from './routes/brands.js';
import modelsRouter from './routes/models.js';
import trimsRouter from './routes/trims.js';
import specsRouter from './routes/specs.js';
import carsRouter from './routes/cars.js';
import spotsRouter from './routes/spots.js';
import { db } from './config/database.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter);

app.use('/users', usersRouter);
app.use('/brands', brandsRouter);
app.use('/models', modelsRouter);
app.use('/trims', trimsRouter);
app.use('/specs', specsRouter);
app.use('/cars', carsRouter);
app.use('/spots', spotsRouter);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CarSpot API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    await db.query('SELECT 1');
    console.log(`✓ Database connected`);
    console.log(`✓ Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
});
