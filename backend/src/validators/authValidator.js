const { check } = require('express-validator');

exports.registerRules = [
    check('firstName', 'First Name is required').notEmpty().trim().escape(),
    check('lastName', 'Last Name must be a string').optional().isString().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
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
    check('newPassword', 'Please enter a new password with 6 or more characters').isLength({ min: 6 })
];
