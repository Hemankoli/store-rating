const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../lib/db');

async function signup({ name, email, password, address }) {
  const { rows } = await pool.query('SELECT id FROM profile WHERE email = $1', [email]);
  if (rows.length) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const hash = await bcrypt.hash(password, 10);
  const id = uuidv4();
  await pool.query(
    'INSERT INTO profile (id, name, email, password, address, role) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, name, email, hash, address, 'user']
  );
  return { id, name, email, address, role: 'user' };
}

async function login({ email, password }) {
  const { rows } = await pool.query('SELECT * FROM profile WHERE email = $1', [email]);
  if (!rows.length) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const profile = rows[0];
  const valid = await bcrypt.compare(password, profile.password);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const token = jwt.sign(
    { id: profile.id, role: profile.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return {
    token,
    user: { id: profile.id, name: profile.name, email: profile.email, role: profile.role },
  };
}

async function changePassword({ userId, currentPassword, newPassword }) {
  const { rows } = await pool.query('SELECT * FROM profile WHERE id = $1', [userId]);
  if (!rows.length) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const profile = rows[0];
  const valid = await bcrypt.compare(currentPassword, profile.password);
  if (!valid) {
    const err = new Error('Current password is incorrect');
    err.status = 400;
    throw err;
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE profile SET password = $1 WHERE id = $2', [hash, userId]);
}

module.exports = { signup, login, changePassword };
