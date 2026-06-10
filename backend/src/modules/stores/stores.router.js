const { Router } = require('express');
const controller = require('./stores.controller');
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');
const validate = require('../../middleware/validate');
const { createStoreSchema, updateStoreSchema } = require('./stores.schema');

const router = Router();

router.use(auth);

router.get('/', requireRole('admin', 'user'), controller.listStores);
router.post('/', requireRole('admin'), validate(createStoreSchema), controller.createStore);
router.get('/:id', requireRole('admin', 'user'), controller.getStoreById);
router.patch('/:id', requireRole('admin'), validate(updateStoreSchema), controller.updateStore);

module.exports = router;
