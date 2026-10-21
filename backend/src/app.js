const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
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

  // Trust first proxy hop behind reverse proxies (e.g. Render, Vercel)
  app.set('trust proxy', 1);

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { message: 'Too many requests, please try again later.' }
  });

  app.use(globalLimiter);

  // Dedicated per-route rate limiter instances to prevent shared exhaustion
  const translateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many translation requests, please try again later.' }
  });

  const currencyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many currency requests, please try again later.' }
  });

  const geocodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many geocoding requests, please try again later.' }
  });

  const mapLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many map/safezone requests, please try again later.' }
  });

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const allowedConfigured = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const allowedProduction = [
        'https://traveldost.vercel.app',
        'https://traveldost-git-main-durgeshjkanzariya.vercel.app',
        ...allowedConfigured
      ];

      // Allow any localhost / 127.0.0.1 port in development
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      // Restrict Vercel origins to only this project's preview deployments
      const isProjectVercel = /^https:\/\/traveldost(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);

      if (isLocalhost || isProjectVercel || allowedProduction.includes(origin)) {
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
  app.use('/api/trips', tripsRouter);
  app.use('/api/translate', translateLimiter, translateRouter);
  app.use('/api/currency', currencyLimiter, currencyRouter);
  app.use('/api/geocode', geocodeLimiter, geocodeRouter);
  app.use('/api/map', mapLimiter, safezonesRouter);
  app.use('/api/admin', adminRoutes);
  app.use('/api/expenses', expensesRouter);

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    const statusCode = err.statusCode || err.status || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : err.message;
    res.status(statusCode).json({ message });
  });

  return app;
}

module.exports = createApp;
