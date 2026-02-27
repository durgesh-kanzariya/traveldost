const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const checklistRoutes = require('./routes/checklist');
const guideRoutes = require('./routes/guideRoutes');
const tripsRouter = require('./routes/trips');
const translateRouter = require('./routes/translate');
const currencyRouter = require('./routes/currency');
const geocodeRouter = require('./routes/geocode');
const safezonesRouter = require('./routes/safezones');
const adminRoutes = require('./routes/adminRoutes');
const authMiddleware = require('./middleware/authMiddleware');

function createApp() {
  const app = express();

  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { message: 'Too many requests, please try again later.' }
  });

  app.use(globalLimiter);

  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173', 'http://127.0.0.1:4173', 'https://traveldost.vercel.app'],
    credentials: true
  }));
  
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('TravelDost Backend (Postgres) is Running!');
  });

  app.get('/db-test', async (req, res) => {
    const pool = require('./config/db');
    try {
      const result = await pool.query('SELECT NOW()');
      res.json({ message: 'Database is active', time: result.rows[0].now });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/checklist', checklistRoutes);
  app.use('/api/guides', guideRoutes);
  app.use('/api/trips', authMiddleware, tripsRouter);
  app.use('/api/translate', translateRouter);
  app.use('/api/currency', currencyRouter);
  app.use('/api/geocode', geocodeRouter);
  app.use('/api/map', safezonesRouter);
  app.use('/api/admin', adminRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  return app;
}

module.exports = createApp;
