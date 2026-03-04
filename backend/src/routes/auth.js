const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const authValidator = require('../validators/authValidator');
const { validateRequest } = require('../middleware/validationMiddleware');

// REGISTRATION ROUTE
router.post('/register', authValidator.registerRules, validateRequest, authController.register);

// LOGIN ROUTE
router.post('/login', authValidator.loginRules, validateRequest, authController.login);

// UPDATE PROFILE
router.put('/profile', authMiddleware, authValidator.updateProfileRules, validateRequest, authController.updateProfile);

// CHANGE PASSWORD
router.put('/password', authMiddleware, authValidator.changePasswordRules, validateRequest, authController.changePassword);

module.exports = router;
