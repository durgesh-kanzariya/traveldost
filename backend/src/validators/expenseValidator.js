const { check, param } = require('express-validator');

exports.expenseRules = [
    check('trip_id', 'Valid Trip ID is required').isInt({ min: 1 }),
    check('amount', 'Valid numeric amount is required (greater than 0)').isFloat({ min: 0.01, max: 100000000 }),
    check('currency', 'Valid currency code is required').optional().isString().isLength({ min: 3, max: 3 }).trim().toUpperCase(),
    check('category', 'Category is required (max 50 characters)').notEmpty().isString().trim().isLength({ max: 50 }).escape(),
    check('description', 'Description format is invalid (max 500 characters)').optional({ checkFalsy: true }).isString().trim().isLength({ max: 500 }).escape(),
    check('expense_date', 'Valid date is required').isISO8601()
];

exports.tripIdParamRule = [
    param('tripId', 'Valid Trip ID is required').isInt({ min: 1 })
];

exports.expenseIdParamRule = [
    param('id', 'Valid Expense ID is required').isInt({ min: 1 })
];
