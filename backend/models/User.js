const pool = require('../config/db');

const User = {
    // Find a user by email
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    // Create a new user
    create: async (user) => {
        const { name, email, password, nativeLanguage } = user;
        const query = `
      INSERT INTO users (name, email, password, native_language)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
        const values = [name, email, password, nativeLanguage];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Update user profile
    update: async (id, { name, email }) => {
        const query = `
      UPDATE users 
      SET name = COALESCE($1, name), email = COALESCE($2, email)
      WHERE id = $3
      RETURNING id, name, email, native_language`;
        const result = await pool.query(query, [name, email, id]);
        return result.rows[0];
    },

    // Update password
    updatePassword: async (id, hashedPassword) => {
        const query = 'UPDATE users SET password = $1 WHERE id = $2';
        await pool.query(query, [hashedPassword, id]);
    },

    // Find by ID
    findById: async (id) => {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = User;
