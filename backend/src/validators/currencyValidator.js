const { param, query } = require('express-validator');

const ALLOWED_CURRENCIES = ['USD', 'EUR', 'INR', 'GBP', 'CAD', 'AUD', 'JPY'];

exports.ALLOWED_CURRENCIES = ALLOWED_CURRENCIES;

exports.currencyRatesRules = [
    param('base')
        .optional()
        .isString()
        .trim()
        .toUpperCase()
        .isIn(ALLOWED_CURRENCIES)
        .withMessage(`Base currency must be one of: ${ALLOWED_CURRENCIES.join(', ')}`),
    query('base')
        .optional()
        .isString()
        .trim()
        .toUpperCase()
        .isIn(ALLOWED_CURRENCIES)
        .withMessage(`Base currency must be one of: ${ALLOWED_CURRENCIES.join(', ')}`)
];
