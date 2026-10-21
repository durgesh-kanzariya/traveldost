const { Pool } = require('pg');
require('dotenv').config();

const isLocalhostUrl = process.env.DATABASE_URL && (
  process.env.DATABASE_URL.includes('localhost') ||
  process.env.DATABASE_URL.includes('127.0.0.1')
);

// Enforce verified TLS certificate validation by default; can be overridden via DB_SSL_REJECT_UNAUTHORIZED for custom environments
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' ? false : true;

const poolConfig = {
  max: parseInt(process.env.DB_POOL_MAX || '20', 10),
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONN_TIMEOUT || '2000', 10),
  ...(process.env.DATABASE_URL
    ? {
      connectionString: process.env.DATABASE_URL,
      ...(isLocalhostUrl ? {} : {
        ssl: {
          rejectUnauthorized
        }
      })
    }
    : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    })
};

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  if (process.env.DATABASE_URL) {
    const maskedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
    console.log(`[Database] Connecting using DATABASE_URL: ${maskedUrl}`);
  } else {
    console.log(`[Database] Connecting to ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  }
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Connected to Database pool');
  }
});

pool.on('error', (err) => {
  console.error('❌ Database Connection Error:', err.message);
});

module.exports = pool;