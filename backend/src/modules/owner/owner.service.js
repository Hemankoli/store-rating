const prisma = require('../../lib/prisma');

async function getDashboard(ownerId, { sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
  const store = await prisma.store.findUnique({ where: { ownerId } });
  if (!store) {
    const err = new Error('No store assigned to this owner');
    err.status = 404;
    throw err;
  }

  const allowedSortFields = ['name', 'email', 'value', 'createdAt'];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'desc' ? 'desc' : 'asc';

  const ratings = await prisma.rating.findMany({
    where: { storeId: store.id },
    orderBy: orderField === 'name' || orderField === 'email'
      ? { user: { [orderField]: order } }
      : { [orderField]: order },
    include: { user: { select: { name: true, email: true } } },
  });

  const values = ratings.map(r => r.value);
  const avgRating = values.length
    ? parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
    : null;

  const raters = ratings.map(r => ({
    name: r.user.name,
    email: r.user.email,
    value: r.value,
    createdAt: r.createdAt,
  }));

  return { store: { id: store.id, name: store.name }, avgRating, raters };
}

module.exports = { getDashboard };
