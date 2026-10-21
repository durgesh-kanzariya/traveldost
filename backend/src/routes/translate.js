const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');
const { translateRules } = require('../validators/translateValidator');
const { validateRequest } = require('../middleware/validationMiddleware');

// @route   GET /api/translate
// @desc    Translate text using MyMemory API
// @access  Public
router.get('/', translateRules, validateRequest, translateController.getTranslation);

module.exports = router;
