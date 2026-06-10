const prisma = require('../../lib/prisma');

async function listStores({ name, address, sortBy = 'name', sortOrder = 'asc', userId }) {
  const allowedSortFields = ['name', 'email', 'address', 'createdAt'];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder === 'desc' ? 'desc' : 'asc';

  const stores = await prisma.store.findMany({
    where: {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(address && { address: { contains: address, mode: 'insensitive' } }),
    },
    orderBy: { [orderField]: order },
    include: {
      ratings: { select: { id: true, value: true, userId: true } },
    },
  });

  return stores.map(store => {
    const values = store.ratings.map(r => r.value);
    const avgRating = values.length
      ? parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
      : null;
    const userRatingObj = userId ? store.ratings.find(r => r.userId === userId) : null;
    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      ownerId: store.ownerId,
      createdAt: store.createdAt,
      avgRating,
      ...(userId !== undefined && {
        userRating: userRatingObj?.value ?? null,
        _ratingId: userRatingObj?.id ?? null,
      }),
    };
  });
}

async function createStore({ name, email, address, ownerId }) {
  const existing = await prisma.store.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Store email already in use');
    err.status = 409;
    throw err;
  }
  return prisma.store.create({
    data: { name, email, address, ...(ownerId && { ownerId }) },
    select: { id: true, name: true, email: true, address: true, ownerId: true, createdAt: true },
  });
}

async function getStoreById(id, userId) {
  const store = await prisma.store.findUnique({
    where: { id },
    include: { ratings: { select: { id: true, value: true, userId: true } } },
  });
  if (!store) {
    const err = new Error('Store not found');
    err.status = 404;
    throw err;
  }
  const values = store.ratings.map(r => r.value);
  const avgRating = values.length
    ? parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
    : null;
  const userRatingObj = userId ? store.ratings.find(r => r.userId === userId) : null;
  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    ownerId: store.ownerId,
    createdAt: store.createdAt,
    avgRating,
    userRating: userRatingObj?.value ?? null,
    _ratingId: userRatingObj?.id ?? null,
  };
}

module.exports = { listStores, createStore, getStoreById };
