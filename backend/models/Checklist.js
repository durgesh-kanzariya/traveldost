const pool = require('../config/db');

const Checklist = {
    findAllByUserId: async (userId) => {
        const query = 'SELECT id, item_name as label, is_checked as checked FROM checklists WHERE user_id = $1 ORDER BY id ASC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    create: async (userId, label) => {
        const query = 'INSERT INTO checklists (user_id, item_name, is_checked) VALUES ($1, $2, $3) RETURNING id, item_name as label, is_checked as checked';
        const result = await pool.query(query, [userId, label, false]);
        return result.rows[0];
    },

    update: async (id, userId, checked) => {
        const query = 'UPDATE checklists SET is_checked = $1 WHERE id = $2 AND user_id = $3';
        await pool.query(query, [checked, id, userId]);
        return { message: 'Updated' };
    },

    delete: async (id, userId) => {
        const query = 'DELETE FROM checklists WHERE id = $1 AND user_id = $2';
        await pool.query(query, [id, userId]);
        return { message: 'Deleted' };
    }
};

module.exports = Checklist;
