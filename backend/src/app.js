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
const expensesRouter = require('./routes/expenses');
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
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const allowedProduction = [
        'https://traveldost.vercel.app',
        'https://traveldost-git-main-durgeshjkanzariya.vercel.app',
      ];

      // Allow any localhost / 127.0.0.1 port in development
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      // Allow any *.vercel.app subdomain for Vercel preview deployments
      const isVercel = origin.endsWith('.vercel.app');

      if (isLocalhost || isVercel || allowedProduction.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
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
  app.use('/api/expenses', expensesRouter);

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
