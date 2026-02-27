const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const checklistRoutes = require('./routes/checklist');
const guideRoutes = require('./routes/guideRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global error handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { message: 'Too many requests, please try again later.' }
});

app.use(globalLimiter);

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173', 'http://127.0.0.1:4173'],
    credentials: true
}));
app.use(express.json());

// --- REMOVED DUPLICATE POOL CONFIGURATION HERE --- 
// (It is now handled in config/db.js)

// Basic Route to check server status
app.get('/', (req, res) => {
  res.send('TravelDost Backend (Postgres) is Running!');
});

// Example Route: Get current server time from DB (Proves DB is working)
app.get('/db-test', async (req, res) => {
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
app.use('/api/trips', require('./middleware/authMiddleware'), require('./routes/trips'));
app.use('/api/translate', require('./routes/translate'));
app.use('/api/currency', require('./routes/currency'));
app.use('/api/geocode', require('./routes/geocode'));
app.use('/api/map', require('./routes/safezones'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port: ${PORT}`);
});