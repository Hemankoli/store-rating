const { v4: uuidv4 } = require('uuid');
const pool = require('../../lib/db');

async function listStores({ name, address, sortBy = 'name', sortOrder = 'asc', userId }) {
  const allowedSortFields = ['name', 'email', 'address', 'createdAt'];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder === 'desc' ? 'DESC' : 'ASC';

  const conditions = [];
  const params = [userId ?? null, userId ?? null];
  let idx = 3;

  if (name)    { conditions.push(`s.name ILIKE $${idx++}`);    params.push(`%${name}%`); }
  if (address) { conditions.push(`s.address ILIKE $${idx++}`); params.push(`%${address}%`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderCol = orderField === 'createdAt' ? `s."createdAt"` : `s.${orderField}`;
  const sql = `
    SELECT s.id, s.name, s.email, s.address, s."ownerId", s."createdAt",
           AVG(r.value) AS "avgRating",
           MAX(CASE WHEN r."userId" = $1 THEN r.value END) AS "userRating",
           MAX(CASE WHEN r."userId" = $2 THEN r.id END) AS "_ratingId"
    FROM store s
    LEFT JOIN rating r ON r."storeId" = s.id
    ${where}
    GROUP BY s.id
    ORDER BY ${orderCol} ${order}`;

  const { rows } = await pool.query(sql, params);

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    address: row.address,
    ownerId: row.ownerId,
    createdAt: row.createdAt,
    avgRating: row.avgRating ? parseFloat(parseFloat(row.avgRating).toFixed(2)) : null,
    ...(userId !== undefined && {
      userRating: row.userRating ?? null,
      _ratingId: row._ratingId ?? null,
    }),
  }));
}

async function createStore({ name, email, address, ownerId }) {
  const { rows: existing } = await pool.query('SELECT id FROM store WHERE email = $1', [email]);
  if (existing.length) {
    const err = new Error('Store email already in use');
    err.status = 409;
    throw err;
  }
  const id = uuidv4();
  await pool.query(
    'INSERT INTO store (id, name, email, address, "ownerId") VALUES ($1, $2, $3, $4, $5)',
    [id, name, email, address, ownerId ?? null]
  );
  return { id, name, email, address, ownerId: ownerId ?? null };
}

async function getStoreById(id, userId) {
  const { rows } = await pool.query(
    `SELECT s.id, s.name, s.email, s.address, s."ownerId", s."createdAt",
            AVG(r.value) AS "avgRating",
            MAX(CASE WHEN r."userId" = $1 THEN r.value END) AS "userRating",
            MAX(CASE WHEN r."userId" = $2 THEN r.id END) AS "_ratingId"
     FROM store s
     LEFT JOIN rating r ON r."storeId" = s.id
     WHERE s.id = $3
     GROUP BY s.id`,
    [userId ?? null, userId ?? null, id]
  );
  if (!rows.length) {
    const err = new Error('Store not found');
    err.status = 404;
    throw err;
  }
  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    address: row.address,
    ownerId: row.ownerId,
    createdAt: row.createdAt,
    avgRating: row.avgRating ? parseFloat(parseFloat(row.avgRating).toFixed(2)) : null,
    userRating: row.userRating ?? null,
    _ratingId: row._ratingId ?? null,
  };
}

module.exports = { listStores, createStore, getStoreById };
