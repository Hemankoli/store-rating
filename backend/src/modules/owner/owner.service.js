const pool = require('../../lib/db');

async function getDashboard(ownerId, { sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
  const { rows: storeRows } = await pool.query(
    'SELECT id, name FROM store WHERE "ownerId" = $1',
    [ownerId]
  );
  if (!storeRows.length) {
    const err = new Error('No store assigned to this owner');
    err.status = 404;
    throw err;
  }
  const store = storeRows[0];

  const allowedSortFields = ['name', 'email', 'value', 'createdAt'];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'desc' ? 'DESC' : 'ASC';

  const orderClause = (orderField === 'name' || orderField === 'email')
    ? `p.${orderField} ${order}`
    : orderField === 'createdAt'
      ? `r."createdAt" ${order}`
      : `r.${orderField} ${order}`;

  const { rows: ratings } = await pool.query(
    `SELECT r.value, r."createdAt", p.name, p.email
     FROM rating r
     JOIN profile p ON p.id = r."userId"
     WHERE r."storeId" = $1
     ORDER BY ${orderClause}`,
    [store.id]
  );

  const values = ratings.map(r => r.value);
  const avgRating = values.length
    ? parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
    : null;

  const raters = ratings.map(r => ({
    name: r.name,
    email: r.email,
    value: r.value,
    createdAt: r.createdAt,
  }));

  return { store: { id: store.id, name: store.name }, avgRating, raters };
}

module.exports = { getDashboard };
