require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
}).on('connect', () => {
  console.log('Database connected successfully');
}).on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;
