const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db'); // <--- IMPORT the shared connection
const authRoutes = require('./routes/auth');
const checklistRoutes = require('./routes/checklist');
const guideRoutes = require('./routes/guideRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
app.use('/api/translate', require('./routes/translate')); // <--- New Translation Route

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});