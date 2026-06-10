const { Router } = require('express');
const controller = require('./users.controller');
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');
const validate = require('../../middleware/validate');
const { createUserSchema } = require('./users.schema');

const router = Router();

router.use(auth, requireRole('admin'));

router.get('/', controller.listUsers);
router.post('/', validate(createUserSchema), controller.createUser);
router.get('/:id', controller.getUserById);

module.exports = router;
