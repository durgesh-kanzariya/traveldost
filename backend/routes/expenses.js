const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const currencyService = require('../services/currencyService');

router.use(authMiddleware);

// GET all expenses for a trip
router.get('/trip/:tripId', async (req, res) => {
    try {
        const userId = req.user.id;
        const { tripId } = req.params;

        // Get Trip Info (to get base currency)
        const tripQuery = 'SELECT currency FROM trips WHERE id = $1 AND user_id = $2';
        const tripResult = await pool.query(tripQuery, [tripId, userId]);
        const baseCurrency = tripResult.rows[0]?.currency || 'USD';

        const query = `
            SELECT e.*, t.start_date as trip_start
            FROM expenses e
            JOIN trips t ON e.trip_id = t.id
            WHERE e.trip_id = $1 AND e.user_id = $2
            ORDER BY e.expense_date DESC
        `;
        const result = await pool.query(query, [tripId, userId]);

        // Get live exchange rates for the base currency for individual conversion
        let rates = {};
        try {
            const rateData = await currencyService.getExchangeRates(baseCurrency);
            rates = rateData.rates;
        } catch (e) {
            console.error('Failed to get rates for list conversion:', e.message);
        }

        const enrichedExpenses = result.rows.map(exp => {
            let normalizedAmount = null;
            if (exp.currency !== baseCurrency && rates[exp.currency]) {
                normalizedAmount = parseFloat(exp.amount) / rates[exp.currency];
            }
            return {
                ...exp,
                trip_currency: baseCurrency,
                normalized_amount: normalizedAmount
            };
        });

        res.json(enrichedExpenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET summary stats for a trip
router.get('/trip/:tripId/summary', async (req, res) => {
    try {
        const userId = req.user.id;
        const { tripId } = req.params;

        // Get Trip Info (to get base currency)
        const tripQuery = 'SELECT budget, currency FROM trips WHERE id = $1 AND user_id = $2';
        const tripResult = await pool.query(tripQuery, [tripId, userId]);

        if (tripResult.rows.length === 0) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const baseCurrency = tripResult.rows[0].currency || 'USD';
        const budget = tripResult.rows[0].budget || 0;

        // Get All Expenses for this trip
        const expensesQuery = 'SELECT amount, currency, category FROM expenses WHERE trip_id = $1 AND user_id = $2';
        const expensesResult = await pool.query(expensesQuery, [tripId, userId]);

        // Get live exchange rates for the base currency
        let rates = {};
        try {
            const rateData = await currencyService.getExchangeRates(baseCurrency);
            rates = rateData.rates;
        } catch (e) {
            console.error('Failed to get rates, summing without conversion:', e.message);
        }

        let totalSpent = 0;
        const categoryTotals = {};

        // Calculate normalized totals
        for (const exp of expensesResult.rows) {
            let normalizedAmount = parseFloat(exp.amount);

            // Convert if currency matches and rates are available
            if (exp.currency !== baseCurrency && rates[exp.currency]) {
                // If we have rates for baseCurrency, we need to convert from exp.currency to baseCurrency
                // rates[target] is how much of target you get for 1 base.
                // So: base_amount = exp_amount / rate[exp_currency]
                normalizedAmount = normalizedAmount / rates[exp.currency];
            } else if (exp.currency !== baseCurrency && !rates[exp.currency]) {
                // Fallback: if rate is missing, we use 1:1 but maybe log it
                console.warn(`Missing rate for ${exp.currency} to ${baseCurrency}`);
            }

            totalSpent += normalizedAmount;

            if (!categoryTotals[exp.category]) {
                categoryTotals[exp.category] = 0;
            }
            categoryTotals[exp.category] += normalizedAmount;
        }

        // Format category breakdown for response
        const byCategory = Object.keys(categoryTotals).map(cat => ({
            category: cat,
            category_total: categoryTotals[cat]
        })).sort((a, b) => b.category_total - a.category_total);

        res.json({
            total_spent: totalSpent,
            budget: budget,
            currency: baseCurrency,
            by_category: byCategory
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST a new expense
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { trip_id, amount, currency, category, description, expense_date } = req.body;
        const query = `
            INSERT INTO expenses (trip_id, user_id, amount, currency, category, description, expense_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const result = await pool.query(query, [trip_id, userId, amount, currency || 'USD', category, description, expense_date || new Date()]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE an expense
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [id, userId]);
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
