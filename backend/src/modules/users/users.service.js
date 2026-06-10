const bcrypt = require('bcryptjs');
const prisma = require('../../lib/prisma');

const USER_SELECT = {
  id: true, name: true, email: true, address: true, role: true, createdAt: true,
};

async function listUsers({ name, email, address, role, sortBy = 'name', sortOrder = 'asc' }) {
  const allowedSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder === 'desc' ? 'desc' : 'asc';

  return prisma.profile.findMany({
    where: {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(email && { email: { contains: email, mode: 'insensitive' } }),
      ...(address && { address: { contains: address, mode: 'insensitive' } }),
      ...(role && { role }),
    },
    orderBy: { [orderField]: order },
    select: USER_SELECT,
  });
}

async function createUser({ name, email, password, address, role }) {
  const existing = await prisma.profile.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const hash = await bcrypt.hash(password, 10);
  return prisma.profile.create({
    data: { name, email, password: hash, address, role },
    select: USER_SELECT,
  });
}

async function getUserById(id) {
  const profile = await prisma.profile.findUnique({
    where: { id },
    select: {
      ...USER_SELECT,
      store: { select: { id: true, name: true } },
    },
  });
  if (!profile) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  if (profile.role === 'store_owner' && profile.store) {
    const avgResult = await prisma.rating.aggregate({
      where: { storeId: profile.store.id },
      _avg: { value: true },
    });
    profile.storeAvgRating = avgResult._avg.value
      ? parseFloat(avgResult._avg.value.toFixed(2))
      : null;
  }
  return profile;
}

module.exports = { listUsers, createUser, getUserById };
