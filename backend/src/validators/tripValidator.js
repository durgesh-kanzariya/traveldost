const { check, param } = require('express-validator');

exports.tripRules = [
    check('destinations', 'Destinations must be an array with 1 to 10 entries')
        .isArray({ min: 1, max: 10 }),
    check('destinations.*', 'Destination names must be non-empty strings (max 100 chars)')
        .isString().trim().notEmpty().isLength({ max: 100 }).escape(),
    check('destination', 'Primary destination must be valid string')
        .optional({ nullable: true }).isString().trim().notEmpty().isLength({ max: 100 }).escape(),
    check('start_date', 'Valid start date is required').isISO8601(),
    check('end_date', 'Valid end date is required').isISO8601()
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.start_date)) {
                throw new Error('End date must be after or on start date');
            }
            return true;
        }),
    check('budget', 'Budget must be a non-negative numeric value up to 100,000,000')
        .optional({ nullable: true }).isFloat({ min: 0, max: 100000000 }),
    check('currency', 'Currency must be a 3-letter currency code')
        .optional({ nullable: true }).isString().trim().isLength({ min: 3, max: 3 }).toUpperCase()
];

exports.tripIdParamRule = [
    param('id', 'Valid Trip ID is required').isInt({ min: 1 })
];
