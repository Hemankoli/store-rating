require('dotenv').config();
const { Pool } = require('pg');

// Internal Render URLs (contain "-internal") don't use SSL.
// External URLs (and local with SSL) do.
const isInternalRender = (process.env.DATABASE_URL || '').includes('-internal');
const sslConfig = isInternalRender ? false : (process.env.DATABASE_URL ? { rejectUnauthorized: false } : false);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
}).on('connect', () => {
  console.log('Database connected successfully');
}).on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;
