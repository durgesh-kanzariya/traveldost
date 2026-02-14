const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// REGISTRATION ROUTE
router.post('/register', authController.register);

// LOGIN ROUTE
router.post('/login', authController.login);

// UPDATE PROFILE
router.put('/profile', require('../middleware/authMiddleware'), authController.updateProfile);

// CHANGE PASSWORD
router.put('/password', require('../middleware/authMiddleware'), authController.changePassword);

module.exports = router;