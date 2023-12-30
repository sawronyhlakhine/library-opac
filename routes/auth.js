const express = require('express');
const router = express.Router();
const PREFIX = '/api/auth';

const rateLimitMiddlewares = require('../middlewares/rateLimit.middleware');
const authMiddlewares = require('../middlewares/auth.middleware');

let authValidator = require('../validations/auth.validator');
let validator = require('../validations/index.validator');

let authController = require('../controllers/auth.controller');

let commonMiddlewares = [
    validator.validate,
    rateLimitMiddlewares.rateLimit
]

router.post(PREFIX + '/register', authValidator.registerRules(), commonMiddlewares, authController.register);
router.post(PREFIX + '/login', authValidator.loginRules(), commonMiddlewares, authController.login);
router.post(PREFIX + '/logout', authMiddlewares.protect, authController.logOut);

module.exports = router;
