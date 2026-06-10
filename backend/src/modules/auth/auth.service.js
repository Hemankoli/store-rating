const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../lib/prisma');

async function signup({ name, email, password, address }) {
  const existing = await prisma.profile.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const hash = await bcrypt.hash(password, 10);
  const profile = await prisma.profile.create({
    data: { name, email, password: hash, address, role: 'user' },
    select: { id: true, name: true, email: true, address: true, role: true },
  });
  return profile;
}

async function login({ email, password }) {
  const profile = await prisma.profile.findUnique({ where: { email } });
  if (!profile) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
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
  const profile = await prisma.profile.findUnique({ where: { id: userId } });
  if (!profile) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const valid = await bcrypt.compare(currentPassword, profile.password);
  if (!valid) {
    const err = new Error('Current password is incorrect');
    err.status = 400;
    throw err;
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.profile.update({ where: { id: userId }, data: { password: hash } });
}

module.exports = { signup, login, changePassword };
