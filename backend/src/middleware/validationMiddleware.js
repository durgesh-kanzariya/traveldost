const { validationResult } = require('express-validator');

/**
 * Middleware to catch express-validator errors and send a formatted 400 response.
 * Placed at the end of a route's validation chain.
 */
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Format errors into a clean array of objects
        const formattedErrors = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));

        console.error('Validation Failed:', formattedErrors);

        return res.status(400).json({
            message: 'Validation Failed',
            errors: formattedErrors
        });
    }
    next();
};

module.exports = { validateRequest };
