const { check, query } = require('express-validator');

exports.geocodeRules = [
    query('lat', 'Valid latitude is required').isFloat({ min: -90, max: 90 }),
    query('lng', 'Valid longitude is required').isFloat({ min: -180, max: 180 })
];
