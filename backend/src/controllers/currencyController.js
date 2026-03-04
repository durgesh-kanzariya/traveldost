const currencyService = require('../services/currencyService');

exports.getRates = async (req, res) => {
    try {
        const { base } = req.params;
        const data = await currencyService.getExchangeRates(base);
        res.json(data);
    } catch (error) {
        console.error('Currency API Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch exchange rates' });
    }
};
