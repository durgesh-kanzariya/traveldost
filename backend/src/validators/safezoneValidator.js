const { check } = require('express-validator');

exports.safezoneRules = [
    check('lat', 'Valid latitude is required (-90 to 90)')
        .exists().withMessage('Latitude is required')
        .custom((val) => val !== null && val !== undefined && val !== '')
        .isFloat({ min: -90, max: 90 }),
    check('lng', 'Valid longitude is required (-180 to 180)')
        .exists().withMessage('Longitude is required')
        .custom((val) => val !== null && val !== undefined && val !== '')
        .isFloat({ min: -180, max: 180 }),
    check('policeRadius', 'Police radius must be between 100 and 50,000 meters').optional().isFloat({ min: 100, max: 50000 }),
    check('hospitalRadius', 'Hospital radius must be between 100 and 50,000 meters').optional().isFloat({ min: 100, max: 50000 })
];
