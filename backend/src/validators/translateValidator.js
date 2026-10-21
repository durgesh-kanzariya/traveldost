const { query } = require('express-validator');

exports.translateRules = [
    query('text', 'Text is required and must not exceed 500 characters')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 1, max: 500 }),
    query('from', 'Source language code is required (2-10 chars)')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 2, max: 10 }),
    query('to', 'Target language code is required (2-10 chars)')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 2, max: 10 })
];
