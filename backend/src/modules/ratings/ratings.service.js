const { v4: uuidv4 } = require('uuid');
const pool = require('../../lib/db');

async function submitRating({ userId, storeId, value }) {
  const { rows: existing } = await pool.query(
    'SELECT id FROM rating WHERE "storeId" = $1 AND "userId" = $2',
    [storeId, userId]
  );
  if (existing.length) {
    const err = new Error('You have already rated this store');
    err.status = 409;
    throw err;
  }
  const id = uuidv4();
  await pool.query(
    'INSERT INTO rating (id, value, "storeId", "userId") VALUES ($1, $2, $3, $4)',
    [id, value, storeId, userId]
  );
  const { rows } = await pool.query(
    'SELECT id, value, "storeId", "userId", "createdAt" FROM rating WHERE id = $1',
    [id]
  );
  return rows[0];
}

async function updateRating({ ratingId, userId, value }) {
  const { rows } = await pool.query('SELECT * FROM rating WHERE id = $1', [ratingId]);
  if (!rows.length) {
    const err = new Error('Rating not found');
    err.status = 404;
    throw err;
  }
  if (rows[0].userId !== userId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  await pool.query('UPDATE rating SET value = $1 WHERE id = $2', [value, ratingId]);
  const { rows: updated } = await pool.query(
    'SELECT id, value, "storeId", "userId", "createdAt" FROM rating WHERE id = $1',
    [ratingId]
  );
  return updated[0];
}

module.exports = { submitRating, updateRating };
