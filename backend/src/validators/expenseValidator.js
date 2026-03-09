const { check } = require('express-validator');

exports.expenseRules = [
    check('amount', 'Valid numeric amount is required').isNumeric(),
    check('currency', 'Valid currency code is required').optional().isString().isLength({ min: 3, max: 3 }).trim().toUpperCase(),
    check('category', 'Category is required').notEmpty().isString().trim(),
    check('description', 'Description format is invalid').optional({ checkFalsy: true }).isString().trim().escape(),
    check('expense_date', 'Valid date is required').isISO8601()
];
