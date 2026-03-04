const { check } = require('express-validator');

exports.updateGuideRules = [
    check('country_name', 'Country name is required').optional().isString().trim(),
    check('police_number', 'Police number is required').optional().isString().trim().escape(),
    check('ambulance_number', 'Ambulance number is required').optional().isString().trim().escape(),
    check('fire_number', 'Fire number is required').optional().isString().trim().escape(),
    check('embassy_number', 'Embassy number is required').optional().isString().trim().escape(),
    check('local_rules', 'Local rules must be an array of strings').optional().isArray(),
    check('local_rules.*', 'Local rule items must be strings').optional().isString().trim().escape()
];

exports.updateUserRoleRules = [
    check('role', 'Valid role is required (e.g., admin, user)').isString().isIn(['admin', 'user']).trim().toLowerCase()
];
