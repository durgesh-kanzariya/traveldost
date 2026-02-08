const { Pool } = require('pg');
require('dotenv').config();

// Fallback for local dev if DATABASE_URL is not set (optional, or just rely on dotenv)
// But cleanest is to use connectionString OR the object.
// Let's make it robust:

const poolConfig = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for most cloud DBs
    },
  }
  : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Connected to LOCAL Database');
});

pool.on('error', (err) => {
  console.error('❌ Database Connection Error:', err);
});

module.exports = pool;