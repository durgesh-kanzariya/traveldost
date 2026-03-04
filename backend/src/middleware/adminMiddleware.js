module.exports = function (req, res, next) {
    // 1. Check if user exists in request (added by authMiddleware)
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // 2. Check Role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();
};
