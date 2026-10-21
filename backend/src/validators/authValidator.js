const { check } = require('express-validator');

exports.registerRules = [
    check('firstName', 'First Name is required').notEmpty().trim().escape(),
    check('lastName', 'Last Name must be a string').optional().isString().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 8 characters and contain both letters and numbers')
        .isLength({ min: 8, max: 128 })
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/),
    check('nativeLanguage', 'Native language must be a string').optional().isString().trim().escape()
];

exports.loginRules = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
];

exports.updateProfileRules = [
    check('firstName', 'First Name must be a string').optional().isString().trim().escape(),
    check('lastName', 'Last Name must be a string').optional().isString().trim().escape(),
    check('email', 'Please include a valid email').optional().isEmail().normalizeEmail(),
    check('nativeLanguage', 'Native language must be a string').optional().isString().trim().escape(),
    check('defaultCurrency', 'Currency code must be strings').optional().isString().isLength({ min: 3, max: 3 }).trim().toUpperCase()
];

exports.changePasswordRules = [
    check('oldPassword', 'Old password is required').exists(),
    check('newPassword', 'New password must be at least 8 characters and contain both letters and numbers')
        .isLength({ min: 8, max: 128 })
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
];
