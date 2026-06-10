const prisma = require('../../lib/prisma');

async function getStats() {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.profile.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  return { totalUsers, totalStores, totalRatings };
}

module.exports = { getStats };
