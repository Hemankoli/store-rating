const storesService = require('./stores.service');

async function listStores(req, res, next) {
  try {
    const { name, address, sortBy, sortOrder } = req.query;
    const userId = req.user.role === 'user' ? req.user.id : undefined;
    const data = await storesService.listStores({ name, address, sortBy, sortOrder, userId });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function createStore(req, res, next) {
  try {
    const data = await storesService.createStore(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getStoreById(req, res, next) {
  try {
    const userId = req.user.role === 'user' ? req.user.id : null;
    const data = await storesService.getStoreById(req.params.id, userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStores, createStore, getStoreById };
