const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Protect all routes with Auth + Admin Check
router.use(authMiddleware);
router.use(adminMiddleware);

// Routes
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/stats', adminController.getStats);

// Guide Routes
router.get('/guides', adminController.getAllGuides);
router.post('/guides', adminController.createGuide);
router.put('/guides/:id', adminController.updateGuide);
router.delete('/guides/:id', adminController.deleteGuide);

module.exports = router;
