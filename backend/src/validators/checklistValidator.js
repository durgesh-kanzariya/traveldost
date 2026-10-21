const { check, param } = require('express-validator');

exports.checklistRules = [
    check('label', 'Item name (label) is required').notEmpty().isString().trim().escape(),
    check('tripId', 'Valid Trip ID is required (numeric)').optional({ nullable: true }).isInt({ min: 1 })
];

exports.updateChecklistRules = [
    param('id', 'Valid item ID is required').isInt({ min: 1 }),
    check('checked', 'Checked status (boolean) is required').isBoolean()
];

exports.itemIdRule = [
    param('id', 'Valid item ID is required').isInt({ min: 1 })
];
