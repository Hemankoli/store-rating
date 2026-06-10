const prisma = require('../../lib/prisma');

async function submitRating({ userId, storeId, value }) {
  const existing = await prisma.rating.findUnique({
    where: { storeId_userId: { storeId, userId } },
  });
  if (existing) {
    const err = new Error('You have already rated this store');
    err.status = 409;
    throw err;
  }
  return prisma.rating.create({
    data: { userId, storeId, value },
    select: { id: true, value: true, storeId: true, userId: true, createdAt: true },
  });
}

async function updateRating({ ratingId, userId, value }) {
  const rating = await prisma.rating.findUnique({ where: { id: ratingId } });
  if (!rating) {
    const err = new Error('Rating not found');
    err.status = 404;
    throw err;
  }
  if (rating.userId !== userId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return prisma.rating.update({
    where: { id: ratingId },
    data: { value },
    select: { id: true, value: true, storeId: true, userId: true, createdAt: true },
  });
}

module.exports = { submitRating, updateRating };
