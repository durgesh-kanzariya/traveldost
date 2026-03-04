const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const currencyService = require('../services/currencyService');

const getExpensesByTrip = async (tripId, userId) => {
    const trip = await Trip.findByIdAndUserId(tripId, userId);
    const baseCurrency = trip?.currency || 'USD';

    const expenses = await Expense.findByTripId(tripId, userId);

    let rates = {};
    try {
        const rateData = await currencyService.getExchangeRates(baseCurrency);
        rates = rateData.rates;
    } catch (e) {
        console.error('Failed to get rates for list conversion:', e.message);
    }

    return expenses.map(exp => {
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
};

const getExpenseSummary = async (tripId, userId) => {
    const trip = await Trip.findByIdAndUserId(tripId, userId);

    if (!trip) {
        throw new Error('Trip not found');
    }

    const baseCurrency = trip.currency || 'USD';
    const budget = trip.budget || 0;

    const expenses = await Expense.getExpensesForSummary(tripId, userId);

    let rates = {};
    try {
        const rateData = await currencyService.getExchangeRates(baseCurrency);
        rates = rateData.rates;
    } catch (e) {
        console.error('Failed to get rates, summing without conversion:', e.message);
    }

    let totalSpent = 0;
    const categoryTotals = {};

    for (const exp of expenses) {
        let normalizedAmount = parseFloat(exp.amount);

        if (exp.currency !== baseCurrency && rates[exp.currency]) {
            normalizedAmount = normalizedAmount / rates[exp.currency];
        }

        totalSpent += normalizedAmount;

        if (!categoryTotals[exp.category]) {
            categoryTotals[exp.category] = 0;
        }
        categoryTotals[exp.category] += normalizedAmount;
    }

    const byCategory = Object.keys(categoryTotals).map(cat => ({
        category: cat,
        category_total: categoryTotals[cat]
    })).sort((a, b) => b.category_total - a.category_total);

    return {
        total_spent: totalSpent,
        budget: budget,
        currency: baseCurrency,
        by_category: byCategory
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
