const { check } = require('express-validator');

exports.checklistRules = [
    check('label', 'Item name (label) is required').notEmpty().isString().trim().escape(),
    check('tripId', 'Valid Trip ID is required (numeric)').optional({ nullable: true }).isNumeric()
];

exports.updateChecklistRules = [
    check('checked', 'Checked status (boolean) is required').isBoolean()
];
