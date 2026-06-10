const { Router } = require('express');
const controller = require('./ratings.controller');
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');
const validate = require('../../middleware/validate');
const { submitRatingSchema, updateRatingSchema } = require('./ratings.schema');

const router = Router();

router.use(auth, requireRole('user'));

router.post('/', validate(submitRatingSchema), controller.submitRating);
router.patch('/:id', validate(updateRatingSchema), controller.updateRating);

module.exports = router;
