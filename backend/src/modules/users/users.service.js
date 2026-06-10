const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../lib/db');

async function listUsers({ name, email, address, role, sortBy = 'name', sortOrder = 'asc' }) {
  const allowedSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder === 'desc' ? 'DESC' : 'ASC';

  const conditions = [];
  const params = [];
  let idx = 1;

  if (name)    { conditions.push(`name ILIKE $${idx++}`);    params.push(`%${name}%`); }
  if (email)   { conditions.push(`email ILIKE $${idx++}`);   params.push(`%${email}%`); }
  if (address) { conditions.push(`address ILIKE $${idx++}`); params.push(`%${address}%`); }
  if (role)    { conditions.push(`role = $${idx++}`);         params.push(role); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const col = orderField === 'createdAt' ? '"createdAt"' : orderField;
  const sql = `SELECT id, name, email, address, role, "createdAt" FROM profile ${where} ORDER BY ${col} ${order}`;
  const { rows } = await pool.query(sql, params);
  return rows;
}

async function createUser({ name, email, password, address, role }) {
  const { rows: existing } = await pool.query('SELECT id FROM profile WHERE email = $1', [email]);
  if (existing.length) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const hash = await bcrypt.hash(password, 10);
  const id = uuidv4();
  await pool.query(
    'INSERT INTO profile (id, name, email, password, address, role) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, name, email, hash, address, role]
  );
  return { id, name, email, address, role };
}

async function getUserById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email, address, role, "createdAt" FROM profile WHERE id = $1',
    [id]
  );
  if (!rows.length) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const profile = rows[0];

  if (profile.role === 'store_owner') {
    const { rows: storeRows } = await pool.query(
      'SELECT id, name FROM store WHERE "ownerId" = $1',
      [id]
    );
    if (storeRows.length) {
      profile.store = storeRows[0];
      const { rows: avgRows } = await pool.query(
        'SELECT AVG(value) AS avg FROM rating WHERE "storeId" = $1',
        [storeRows[0].id]
      );
      const avg = avgRows[0].avg;
      profile.storeAvgRating = avg ? parseFloat(parseFloat(avg).toFixed(2)) : null;
    }
  }
  return profile;
}

module.exports = { listUsers, createUser, getUserById };
