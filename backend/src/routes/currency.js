const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

router.get('/rates/:base', currencyController.getRates);

module.exports = router;
