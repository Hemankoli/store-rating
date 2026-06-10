const { Router } = require('express');
const controller = require('./auth.controller');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const { signupSchema, loginSchema, changePasswordSchema } = require('./auth.schema');

const router = Router();

router.post('/signup', validate(signupSchema), controller.signup);
router.post('/login', validate(loginSchema), controller.login);
router.post('/logout', auth, controller.logout);
router.patch('/password', auth, validate(changePasswordSchema), controller.changePassword);

module.exports = router;
