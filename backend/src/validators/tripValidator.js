const { check } = require('express-validator');

exports.tripRules = [
    check('destinations', 'Destinations must be a non-empty array')
        .isArray({ min: 1 }),
    check('destinations.*', 'Destination names must be strings').isString().trim().escape(),
    check('destination', 'Primary destination is required').optional({ nullable: true }).isString().trim().escape(),
    check('start_date', 'Valid start date is required').isISO8601(),
    check('end_date', 'Valid end date is required').isISO8601()
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.start_date)) {
                throw new Error('End date must be after or on start date');
            }
            return true;
        }),
    check('budget', 'Budget must be a numeric value').optional({ nullable: true }).isNumeric(),
    check('currency', 'Currency must be a string').optional({ nullable: true }).isString().trim().toUpperCase()
];
