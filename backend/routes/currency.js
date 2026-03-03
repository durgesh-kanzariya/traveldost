const express = require('express');
const router = express.Router();
const currencyService = require('../services/currencyService');

router.get('/rates/:base', async (req, res) => {
    try {
        const { base } = req.params;
        const data = await currencyService.getExchangeRates(base);
        res.json(data);
    } catch (error) {
        console.error('Currency API Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch exchange rates' });
    }
});

module.exports = router;
