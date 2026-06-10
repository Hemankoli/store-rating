const ownerService = require('./owner.service');

async function getDashboard(req, res, next) {
  try {
    const { sortBy, sortOrder } = req.query;
    const data = await ownerService.getDashboard(req.user.id, { sortBy, sortOrder });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
