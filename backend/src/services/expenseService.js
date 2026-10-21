const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const currencyService = require('../services/currencyService');

const getExpensesByTrip = async (tripId, userId, pagination) => {
    const trip = await Trip.findByIdAndUserId(tripId, userId);
    const baseCurrency = trip?.currency || 'USD';

    const expenses = await Expense.findByTripId(tripId, userId, pagination);

    let rates = {};
    let ratesAvailable = false;
    try {
        const rateData = await currencyService.getExchangeRates(baseCurrency);
        rates = rateData.rates || {};
        ratesAvailable = true;
    } catch (e) {
        console.error('Failed to get rates for list conversion:', e.message);
    }

    return expenses.map(exp => {
        const expAmount = parseFloat(exp.amount);
        let normalizedAmount = null;
        let conversionStatus = 'unavailable';

        if (exp.currency === baseCurrency) {
            normalizedAmount = expAmount;
            conversionStatus = 'same_currency';
        } else if (ratesAvailable && rates[exp.currency]) {
            normalizedAmount = expAmount / rates[exp.currency];
            conversionStatus = 'converted';
        }

        return {
            ...exp,
            trip_currency: baseCurrency,
            normalized_amount: normalizedAmount !== null ? Number(normalizedAmount.toFixed(2)) : null,
            conversion_status: conversionStatus
        };
    });
};

const getExpenseSummary = async (tripId, userId) => {
    const trip = await Trip.findByIdAndUserId(tripId, userId);

    if (!trip) {
        const error = new Error('Trip not found');
        error.statusCode = 404;
        throw error;
    }

    const baseCurrency = trip.currency || 'USD';
    const budget = trip.budget || 0;

    const expenses = await Expense.getExpensesForSummary(tripId, userId);

    let rates = {};
    let ratesAvailable = false;
    try {
        const rateData = await currencyService.getExchangeRates(baseCurrency);
        rates = rateData.rates || {};
        ratesAvailable = true;
    } catch (e) {
        console.error('Failed to get rates for summary calculation:', e.message);
    }

    let totalSpent = 0;
    const categoryTotals = {};
    const currencyTotals = {};
    let unconvertedCount = 0;

    for (const exp of expenses) {
        const rawAmount = parseFloat(exp.amount) || 0;
        currencyTotals[exp.currency] = (currencyTotals[exp.currency] || 0) + rawAmount;

        let normalizedAmount = null;
        if (exp.currency === baseCurrency) {
            normalizedAmount = rawAmount;
        } else if (ratesAvailable && rates[exp.currency]) {
            normalizedAmount = rawAmount / rates[exp.currency];
        } else {
            unconvertedCount++;
        }

        if (normalizedAmount !== null) {
            totalSpent += normalizedAmount;
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + normalizedAmount;
        }
    }

    const byCategory = Object.keys(categoryTotals).map(cat => ({
        category: cat,
        category_total: Number(categoryTotals[cat].toFixed(2))
    })).sort((a, b) => b.category_total - a.category_total);

    return {
        total_spent: Number(totalSpent.toFixed(2)),
        budget: budget,
        currency: baseCurrency,
        by_category: byCategory,
        by_currency: currencyTotals,
        conversion_status: unconvertedCount === 0 ? 'complete' : (unconvertedCount < expenses.length ? 'partial' : 'unavailable'),
        unconverted_items_count: unconvertedCount
    };
};

const addExpense = async (userId, data) => {
    return await Expense.create(userId, data);
};

const deleteExpense = async (id, userId) => {
    await Expense.delete(id, userId);
};

module.exports = {
    getExpensesByTrip,
    getExpenseSummary,
    addExpense,
    deleteExpense
};
