const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');

// @route   GET /api/translate
// @desc    Translate text using MyMemory API
// @access  Public
router.get('/', translateController.getTranslation);

module.exports = router;
