const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checklistController = require('../controllers/checklistController');

// All routes are protected
router.get('/', auth, checklistController.getItems);
router.post('/', auth, checklistController.addItem);
router.put('/:id', auth, checklistController.updateItem);
router.delete('/:id', auth, checklistController.deleteItem);

module.exports = router;