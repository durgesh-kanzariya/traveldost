const pool = require('../config/db');

const Checklist = {
    findAllByUserId: async (userId, tripId = null) => {
        let query = 'SELECT id, item_name as label, is_checked as checked, trip_id FROM checklists WHERE user_id = $1';
        const values = [userId];
        
        if (tripId) {
            query += ' AND trip_id = $2';
            values.push(tripId);
        } else {
            query += ' AND trip_id IS NULL';
        }
        
        query += ' ORDER BY id ASC';
        const result = await pool.query(query, values);
        return result.rows;
    },

    create: async (userId, label, tripId = null) => {
        const query = 'INSERT INTO checklists (user_id, item_name, is_checked, trip_id) VALUES ($1, $2, $3, $4) RETURNING id, item_name as label, is_checked as checked, trip_id';
        const result = await pool.query(query, [userId, label, false, tripId]);
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
