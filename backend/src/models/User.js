const pool = require('../config/db');

const User = {
    // Find a user by email
    findByEmail: async (email) => {
        const query = `
            SELECT u.id, u.first_name, u.last_name, u.email, u.password, u.created_at,
                   up.native_language, up.default_currency, r.role_name as role
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.email = $1
        `;
        const result = await pool.query(query, [email]);
        if (result.rows[0] && result.rows[0].role) {
            result.rows[0].role = result.rows[0].role.toLowerCase();
        }
        return result.rows[0];
    },

    // Create a new user
    create: async (user) => {
        const { firstName, lastName, email, password, nativeLanguage = 'English', role = 'user' } = user;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const userQuery = 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
            const userResult = await client.query(userQuery, [firstName, lastName, email, password]);
            const newUser = userResult.rows[0];

            await client.query('INSERT INTO user_profiles (user_id, native_language) VALUES ($1, $2)', [newUser.id, nativeLanguage]);

            const roleName = role.toLowerCase() === 'admin' ? 'Admin' : 'User';
            const roleQuery = 'SELECT id FROM roles WHERE role_name = $1';
            const roleResult = await client.query(roleQuery, [roleName]);
            if (roleResult.rows.length > 0) {
                await client.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [newUser.id, roleResult.rows[0].id]);
            }

            await client.query('COMMIT');

            newUser.native_language = nativeLanguage;
            newUser.role = roleName.toLowerCase();
            return newUser;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },

    // Find all users (for Admin)
    findAll: async () => {
        const query = `
            SELECT u.id, u.first_name, u.last_name, u.email, u.created_at, up.native_language, up.default_currency, LOWER(r.role_name) as role
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            ORDER BY u.id ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    // Count all users
    count: async () => {
        const query = 'SELECT COUNT(*) FROM users';
        const result = await pool.query(query);
        return parseInt(result.rows[0].count, 10);
    },

    // Delete user
    delete: async (id) => {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Update user profile
    update: async (id, { firstName, lastName, email, nativeLanguage, defaultCurrency }) => {
        const query = `
            UPDATE users 
            SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), email = COALESCE($3, email)
            WHERE id = $4
            RETURNING id, first_name, last_name, email
        `;
        const result = await pool.query(query, [firstName, lastName, email, id]);

        // Also update user_profiles for the new fields
        await pool.query(`
            INSERT INTO user_profiles (user_id, native_language, default_currency)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id) DO UPDATE
            SET native_language = COALESCE($2, user_profiles.native_language),
                default_currency = COALESCE($3, user_profiles.default_currency)
        `, [id, nativeLanguage, defaultCurrency]);

        const langResult = await pool.query('SELECT native_language, default_currency FROM user_profiles WHERE user_id = $1', [id]);
        if (result.rows[0]) {
            result.rows[0].native_language = langResult.rows[0]?.native_language || 'English';
            result.rows[0].default_currency = langResult.rows[0]?.default_currency || 'USD';
        }
        return result.rows[0];
    },

    // Update password
    updatePassword: async (id, hashedPassword) => {
        const query = 'UPDATE users SET password = $1 WHERE id = $2';
        await pool.query(query, [hashedPassword, id]);
    },

    // Find by ID
    findById: async (id) => {
        const query = `
            SELECT u.id, u.first_name, u.last_name, u.email, u.password, u.created_at,
                   up.native_language, up.default_currency, r.role_name as role
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.id = $1
        `;
        const result = await pool.query(query, [id]);
        if (result.rows[0] && result.rows[0].role) {
            result.rows[0].role = result.rows[0].role.toLowerCase();
        }
        return result.rows[0];
    }
};

module.exports = User;
