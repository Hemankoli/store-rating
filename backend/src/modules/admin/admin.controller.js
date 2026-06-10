const adminService = require('./admin.service');

async function getStats(req, res, next) {
  try {
    const data = await adminService.getStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
