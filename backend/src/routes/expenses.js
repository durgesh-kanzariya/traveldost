const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const expenseValidator = require('../validators/expenseValidator');
const { validateRequest } = require('../middleware/validationMiddleware');

router.use(authMiddleware);

// GET all expenses for a trip
router.get('/trip/:tripId', expenseValidator.tripIdParamRule, validateRequest, expenseController.getTripExpenses);

// GET summary stats for a trip
router.get('/trip/:tripId/summary', expenseValidator.tripIdParamRule, validateRequest, expenseController.getTripSummary);

// POST a new expense
router.post('/', expenseValidator.expenseRules, validateRequest, expenseController.createExpense);

// DELETE an expense
router.delete('/:id', expenseValidator.expenseIdParamRule, validateRequest, expenseController.deleteExpense);

module.exports = router;
