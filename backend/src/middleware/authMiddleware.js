const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

module.exports = async function (req, res, next) {
  // 1. Get token from header
  const token = req.header('x-auth-token');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Verify token and validate that account currently exists
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userResult = await pool.query(
      `SELECT u.id, LOWER(r.role_name) as role 
       FROM users u 
       LEFT JOIN user_roles ur ON u.id = ur.user_id 
       LEFT JOIN roles r ON ur.role_id = r.id 
       WHERE u.id = $1`,
      [decoded.id]
    );

    if (userResult.rowCount === 0) {
      return res.status(401).json({ message: 'User account no longer exists, authorization denied' });
    }

    req.user = {
      id: decoded.id,
      role: userResult.rows[0].role || decoded.role || 'user'
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};