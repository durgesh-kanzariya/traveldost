const express = require('express');
const router = express.Router();
const geocodeController = require('../controllers/geocodeController');
const geocodeValidator = require('../validators/geocodeValidator');
const { validateRequest } = require('../middleware/validationMiddleware');

router.get('/reverse', geocodeValidator.geocodeRules, validateRequest, geocodeController.reverseGeocode);

module.exports = router;
