const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');
const { currencyRatesRules } = require('../validators/currencyValidator');
const { validateRequest } = require('../middleware/validationMiddleware');

router.get('/rates/:base', currencyRatesRules, validateRequest, currencyController.getRates);
router.get('/rates', currencyRatesRules, validateRequest, (req, res) => {
    req.params.base = req.query.base || 'USD';
    currencyController.getRates(req, res);
});

module.exports = router;
