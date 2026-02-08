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

console.log('--- DB CONFIG START ---');
if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL');
  // Mask password for security
  console.log('Connection String:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
} else {
  console.log('Using Individual Env Vars');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_PORT:', process.env.DB_PORT);
}
console.log('--- DB CONFIG END ---');

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Connected to LOCAL Database');
});

pool.on('error', (err) => {
  console.error('❌ Database Connection Error:', err);
});

module.exports = pool;