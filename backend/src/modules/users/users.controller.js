const usersService = require('./users.service');

async function listUsers(req, res, next) {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;
    const data = await usersService.listUsers({ name, email, address, role, sortBy, sortOrder });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const data = await usersService.createUser(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const data = await usersService.getUserById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, createUser, getUserById };
