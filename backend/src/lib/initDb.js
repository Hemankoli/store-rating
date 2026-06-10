require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function init() {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await pool.query(stmt);
  }
  console.log('Database tables created.');
  await pool.end();
}

init().catch(e => { console.error(e); process.exit(1); });
