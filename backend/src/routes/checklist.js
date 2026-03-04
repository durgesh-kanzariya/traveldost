const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checklistController = require('../controllers/checklistController');
const checklistValidator = require('../validators/checklistValidator');
const { validateRequest } = require('../middleware/validationMiddleware');

// All routes are protected
router.get('/', auth, checklistController.getItems);
router.post('/', auth, checklistValidator.checklistRules, validateRequest, checklistController.addItem);
router.put('/:id', auth, checklistValidator.updateChecklistRules, validateRequest, checklistController.updateItem);
router.delete('/:id', auth, checklistController.deleteItem);

module.exports = router;