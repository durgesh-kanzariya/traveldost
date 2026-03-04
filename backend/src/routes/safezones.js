const express = require('express');
const router = express.Router();
const safezoneController = require('../controllers/safezoneController');
const safezoneValidator = require('../validators/safezoneValidator');
const { validateRequest } = require('../middleware/validationMiddleware');

router.post('/safezones', safezoneValidator.safezoneRules, validateRequest, safezoneController.getSafeZones);

module.exports = router;
