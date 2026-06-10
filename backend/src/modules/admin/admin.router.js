const { Router } = require('express');
const controller = require('./admin.controller');
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');

const router = Router();

router.use(auth, requireRole('admin'));

router.get('/stats', controller.getStats);

module.exports = router;
