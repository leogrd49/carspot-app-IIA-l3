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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/models', modelsRouter);
app.use('/api/trims', trimsRouter);
app.use('/api/specs', specsRouter);
app.use('/api/cars', carsRouter);
app.use('/api/spots', spotsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CarSpot API is running' });
});

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
