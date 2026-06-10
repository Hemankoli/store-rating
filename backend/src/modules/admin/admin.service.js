const pool = require('../../lib/db');

async function getStats() {
  const [r1, r2, r3] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM profile'),
    pool.query('SELECT COUNT(*) AS total FROM store'),
    pool.query('SELECT COUNT(*) AS total FROM rating'),
  ]);
  return {
    totalUsers: Number(r1.rows[0].total),
    totalStores: Number(r2.rows[0].total),
    totalRatings: Number(r3.rows[0].total),
  };
}

module.exports = { getStats };
