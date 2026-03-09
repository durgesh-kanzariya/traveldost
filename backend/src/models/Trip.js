const pool = require('../config/db');

const Trip = {
    findAllByUserId: async (userId) => {
        const query = `
            SELECT t.*, 
                   (SELECT d.location_name 
                    FROM trip_destinations td 
                    JOIN destinations d ON td.destination_id = d.id 
                    WHERE td.trip_id = t.id 
                    ORDER BY td.visit_order ASC LIMIT 1) as destination,
                   ARRAY(
                    SELECT d.location_name 
                    FROM trip_destinations td 
                    JOIN destinations d ON td.destination_id = d.id 
                    WHERE td.trip_id = t.id 
                    ORDER BY td.visit_order ASC
                   ) as destinations
            FROM trips t
            WHERE t.user_id = $1 
            ORDER BY t.start_date DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    findUpcomingByUserId: async (userId) => {
        const query = `
            SELECT t.*, 
                   (SELECT d.location_name 
                    FROM trip_destinations td 
                    JOIN destinations d ON td.destination_id = d.id 
                    WHERE td.trip_id = t.id 
                    ORDER BY td.visit_order ASC LIMIT 1) as destination
            FROM trips t
            WHERE t.user_id = $1 
            AND t.start_date >= CURRENT_DATE 
            AND t.start_date <= CURRENT_DATE + INTERVAL '14 days'
            ORDER BY t.start_date ASC
            LIMIT 1
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0] || null;
    },

    findByIdAndUserId: async (id, userId) => {
        const query = 'SELECT * FROM trips WHERE id = $1 AND user_id = $2';
        const result = await pool.query(query, [id, userId]);
        return result.rows[0] || null;
    },

    create: async ({ userId, start_date, end_date, budget, currency }, dbClient = pool) => {
        const query = `
            INSERT INTO trips (user_id, start_date, end_date, budget, currency)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await dbClient.query(query, [userId, start_date, end_date, budget, currency || 'USD']);
        return result.rows[0];
    },

    update: async (id, userId, data, dbClient = pool) => {
        const { start_date, end_date, budget, currency } = data;
        const query = `
            UPDATE trips 
            SET start_date = COALESCE($1, start_date),
                end_date = COALESCE($2, end_date),
                budget = COALESCE($3, budget),
                currency = COALESCE($4, currency)
            WHERE id = $5 AND user_id = $6
            RETURNING *
        `;
        const result = await dbClient.query(query, [start_date, end_date, budget, currency, id, userId]);
        return result.rows[0];
    },

    delete: async (id, userId) => {
        const query = 'DELETE FROM trips WHERE id = $1 AND user_id = $2';
        await pool.query(query, [id, userId]);
    },

    getChecklistCount: async (userId, tripId) => {
        const query = `
            SELECT COUNT(*) as count 
            FROM checklist_items ci 
            JOIN custom_checklists cc ON ci.checklist_id = cc.id 
            WHERE cc.user_id = $1 AND cc.trip_id = $2
        `;
        const result = await pool.query(query, [userId, tripId]);
        return parseInt(result.rows[0].count, 10);
    },

    addDestination: async (tripId, destinationId, visitOrder, dbClient = pool) => {
        const query = 'INSERT INTO trip_destinations (trip_id, destination_id, visit_order) VALUES ($1, $2, $3)';
        await dbClient.query(query, [tripId, destinationId, visitOrder]);
    },

    clearDestinations: async (tripId, dbClient = pool) => {
        await dbClient.query('DELETE FROM trip_destinations WHERE trip_id = $1', [tripId]);
    }
};

module.exports = Trip;
