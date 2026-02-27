const express = require('express');
const router = express.Router();

const currencyCache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

const getRates = async (base) => {
    const now = Date.now();
    const cached = currencyCache.get(base);

    if (cached && (now - cached.timestamp < CACHE_TTL)) {
        return cached.data;
    }

    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
    if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    currencyCache.set(base, { data, timestamp: now });

    return data;
};

router.get('/rates/:base', async (req, res) => {
    try {
        const { base } = req.params;
        const data = await getRates(base);
        res.json(data);
    } catch (error) {
        console.error('Currency API Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch exchange rates' });
    }
});

module.exports = router;
