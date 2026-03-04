const { check } = require('express-validator');

exports.safezoneRules = [
    check('lat', 'Valid latitude is required').isFloat({ min: -90, max: 90 }),
    check('lng', 'Valid longitude is required').isFloat({ min: -180, max: 180 }),
    check('policeRadius', 'Police radius must be a number').optional().isNumeric(),
    check('hospitalRadius', 'Hospital radius must be a number').optional().isNumeric()
];
