const { query } = require('express-validator');

const ALLOWED_LANGUAGES = [
    'en', 'es', 'fr', 'de', 'hi', 'gu', 'zh', 'zh-tw', 'ar', 'bn', 'ru', 'ja',
    'pt', 'it', 'ko', 'tr', 'vi', 'th', 'nl', 'pl', 'id', 'ps', 'fa', 'he',
    'ms', 'ne', 'ur', 'tl', 'si', 'sq', 'hr', 'cs', 'da', 'fi', 'el', 'hu',
    'is', 'ga', 'no', 'ro', 'sv', 'uk', 'am', 'sw', 'fj'
];

exports.ALLOWED_LANGUAGES = ALLOWED_LANGUAGES;

exports.translateRules = [
    query('text', 'Text is required and must not exceed 500 characters')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 1, max: 500 }),
    query('from', 'Valid source ISO language code is required')
        .notEmpty()
        .isString()
        .trim()
        .custom((val) => ALLOWED_LANGUAGES.includes(val.toLowerCase())),
    query('to', 'Valid target ISO language code is required')
        .notEmpty()
        .isString()
        .trim()
        .custom((val) => ALLOWED_LANGUAGES.includes(val.toLowerCase()))
];
