const pool = require('../config/db');

const Expense = {
    findByTripId: async (tripId, userId) => {
        const query = `
            SELECT e.*, t.start_date as trip_start
            FROM expenses e
            JOIN trips t ON e.trip_id = t.id
            WHERE e.trip_id = $1 AND e.user_id = $2
            ORDER BY e.expense_date DESC
        `;
        const result = await pool.query(query, [tripId, userId]);
        return result.rows;
    },

    getExpensesForSummary: async (tripId, userId) => {
        const query = 'SELECT amount, currency, category FROM expenses WHERE trip_id = $1 AND user_id = $2';
        const result = await pool.query(query, [tripId, userId]);
        return result.rows;
    },

    create: async (userId, data) => {
        const { trip_id, amount, currency, category, description, expense_date } = data;
        const query = `
            INSERT INTO expenses (trip_id, user_id, amount, currency, category, description, expense_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const result = await pool.query(query, [trip_id, userId, amount, currency || 'USD', category, description, expense_date || new Date()]);
        return result.rows[0];
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [id, userId]);
    },

    deleteByTripId: async (tripId, userId) => {
        await pool.query('DELETE FROM custom_checklists WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
    },

    moveChecklistToGeneral: async (tripId, userId) => {
        await pool.query('UPDATE custom_checklists SET trip_id = NULL WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
    }
};

module.exports = Expense;
