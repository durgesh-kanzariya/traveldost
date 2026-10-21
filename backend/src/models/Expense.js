const pool = require('../config/db');

const Expense = {
    findByTripId: async (tripId, userId, { limit = 100, offset = 0 } = {}) => {
        const boundedLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 200);
        const boundedOffset = Math.max(parseInt(offset, 10) || 0, 0);
        const query = `
            SELECT e.id, e.trip_id, e.user_id, e.amount, e.currency, e.category, e.description, e.expense_date, e.created_at, t.start_date as trip_start
            FROM expenses e
            JOIN trips t ON e.trip_id = t.id
            WHERE e.trip_id = $1 AND e.user_id = $2
            ORDER BY e.expense_date DESC, e.id DESC
            LIMIT $3 OFFSET $4
        `;
        const result = await pool.query(query, [tripId, userId, boundedLimit, boundedOffset]);
        return result.rows;
    },

    getExpensesForSummary: async (tripId, userId) => {
        const query = 'SELECT amount, currency, category FROM expenses WHERE trip_id = $1 AND user_id = $2';
        const result = await pool.query(query, [tripId, userId]);
        return result.rows;
    },

    create: async (userId, data) => {
        const { trip_id, amount, currency, category, description, expense_date } = data;
        
        // Verify parent trip exists and belongs to user
        const tripCheck = await pool.query(
            'SELECT id, currency FROM trips WHERE id = $1 AND user_id = $2',
            [trip_id, userId]
        );
        if (tripCheck.rowCount === 0) {
            const error = new Error('Trip not found');
            error.statusCode = 404;
            throw error;
        }

        const query = `
            INSERT INTO expenses (trip_id, user_id, amount, currency, category, description, expense_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const result = await pool.query(query, [
            trip_id,
            userId,
            amount,
            currency || tripCheck.rows[0].currency || 'USD',
            category,
            description,
            expense_date || new Date()
        ]);
        return result.rows[0];
    },

    delete: async (id, userId) => {
        const result = await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [id, userId]);
        if (result.rowCount === 0) {
            const err = new Error('Expense not found');
            err.statusCode = 404;
            throw err;
        }
    },

    deleteByTripId: async (tripId, userId) => {
        await pool.query('DELETE FROM custom_checklists WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
    },

    moveChecklistToGeneral: async (tripId, userId) => {
        await pool.query('UPDATE custom_checklists SET trip_id = NULL WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
    }
};

module.exports = Expense;
