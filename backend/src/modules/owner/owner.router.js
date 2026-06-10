const { Router } = require('express');
const controller = require('./owner.controller');
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');

const router = Router();

router.use(auth, requireRole('store_owner'));

router.get('/dashboard', controller.getDashboard);

module.exports = router;
