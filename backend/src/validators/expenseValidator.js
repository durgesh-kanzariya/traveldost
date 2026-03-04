const { check } = require('express-validator');

exports.expenseRules = [
    check('amount', 'Valid numeric amount is required').isNumeric(),
    check('currency', 'Valid currency code is required').optional().isString().isLength({ min: 3, max: 3 }).trim().toUpperCase(),
    check('category', 'Category is required').notEmpty().isString().trim(),
    check('description', 'Description is required').notEmpty().isString().trim().escape(),
    check('date', 'Valid date is required').isISO8601()
];
