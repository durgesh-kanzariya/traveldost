const expenseService = require('../services/expenseService');

// GET all expenses for a trip
exports.getTripExpenses = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tripId } = req.params;
        const expenses = await expenseService.getExpensesByTrip(tripId, userId);
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET summary stats for a trip
exports.getTripSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tripId } = req.params;
        const summary = await expenseService.getExpenseSummary(tripId, userId);
        res.json(summary);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Trip not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST a new expense
exports.createExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const savedExpense = await expenseService.addExpense(userId, req.body);
        res.status(201).json(savedExpense);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE an expense
exports.deleteExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await expenseService.deleteExpense(id, userId);
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
