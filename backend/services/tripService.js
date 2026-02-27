const pool = require('../config/db');

const getTripsByUser = async (userId) => {
    const query = `
        SELECT * FROM trips 
        WHERE user_id = $1 
        ORDER BY start_date DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

const getUpcomingTrip = async (userId) => {
    const query = `
        SELECT * FROM trips 
        WHERE user_id = $1 
        AND start_date >= CURRENT_DATE 
        AND start_date <= CURRENT_DATE + INTERVAL '14 days'
        ORDER BY start_date ASC
        LIMIT 1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
};

const createTrip = async (userId, tripData) => {
    const { destination, start_date, end_date, budget, currency } = tripData;
    const query = `
        INSERT INTO trips (user_id, destination, start_date, end_date, budget, currency)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const values = [userId, destination, start_date, end_date, budget, currency || 'USD'];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateTrip = async (userId, tripId, tripData) => {
    const { destination, start_date, end_date, budget, currency } = tripData;
    
    const checkQuery = 'SELECT * FROM trips WHERE id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [tripId, userId]);
    
    if (checkResult.rows.length === 0) {
        throw new Error('Trip not found');
    }

    const query = `
        UPDATE trips 
        SET destination = COALESCE($1, destination),
            start_date = COALESCE($2, start_date),
            end_date = COALESCE($3, end_date),
            budget = COALESCE($4, budget),
            currency = COALESCE($5, currency)
        WHERE id = $6 AND user_id = $7
        RETURNING *
    `;
    const values = [destination, start_date, end_date, budget, currency, tripId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteTrip = async (userId, tripId, checklistAction = 'move_to_general') => {
    const checkQuery = 'SELECT * FROM trips WHERE id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [tripId, userId]);
    
    if (checkResult.rows.length === 0) {
        throw new Error('Trip not found');
    }

    // Handle checklist items based on action
    if (checklistAction === 'delete_items') {
        // Delete all checklist items for this trip
        await pool.query('DELETE FROM checklists WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
    } else {
        // Default: Move items to general (set trip_id to NULL)
        await pool.query('UPDATE checklists SET trip_id = NULL WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
    }

    // Delete the trip
    const query = 'DELETE FROM trips WHERE id = $1 AND user_id = $2';
    await pool.query(query, [tripId, userId]);
};

const getChecklistCount = async (userId, tripId) => {
    const query = 'SELECT COUNT(*) as count FROM checklists WHERE user_id = $1 AND trip_id = $2';
    const result = await pool.query(query, [userId, tripId]);
    return parseInt(result.rows[0].count, 10);
};

module.exports = {
    getTripsByUser,
    getUpcomingTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    getChecklistCount
};
