const pool = require('../config/db');

const getTripsByUser = async (userId) => {
    const query = `
        SELECT t.*, 
               (SELECT d.city_name 
                FROM trip_destinations td 
                JOIN destinations d ON td.destination_id = d.id 
                WHERE td.trip_id = t.id 
                ORDER BY td.visit_order ASC LIMIT 1) as destination,
               ARRAY(
                SELECT d.city_name 
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
};

const getUpcomingTrip = async (userId) => {
    const query = `
        SELECT t.*, 
               (SELECT d.city_name 
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
};

const createTrip = async (userId, tripData) => {
    const { destinations = [], destination, start_date, end_date, budget, currency } = tripData;

    // Support both old single `destination` and new `destinations` array
    const destList = destinations.length > 0 && destinations.some(d => d)
        ? destinations.filter(d => d && d.trim())
        : (destination ? [destination] : []);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const tripQuery = `
            INSERT INTO trips (user_id, start_date, end_date, budget, currency)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const tripResult = await client.query(tripQuery, [userId, start_date, end_date, budget, currency || 'USD']);
        const newTrip = tripResult.rows[0];

        for (let i = 0; i < destList.length; i++) {
            const destName = destList[i];
            let destId;
            const destQuery = 'SELECT id FROM destinations WHERE city_name = $1';
            const destResult = await client.query(destQuery, [destName]);

            if (destResult.rows.length > 0) {
                destId = destResult.rows[0].id;
            } else {
                const newDestQuery = 'INSERT INTO destinations (city_name, country_name) VALUES ($1, $2) RETURNING id';
                const newDestResult = await client.query(newDestQuery, [destName, 'Unknown']);
                destId = newDestResult.rows[0].id;
            }

            const mapQuery = 'INSERT INTO trip_destinations (trip_id, destination_id, visit_order) VALUES ($1, $2, $3)';
            await client.query(mapQuery, [newTrip.id, destId, i + 1]);
        }

        await client.query('COMMIT');
        newTrip.destination = destList[0] || null;
        newTrip.destinations = destList;
        return newTrip;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

const updateTrip = async (userId, tripId, tripData) => {
    const { destinations = [], destination, start_date, end_date, budget, currency } = tripData;

    const destList = destinations.length > 0 && destinations.some(d => d)
        ? destinations.filter(d => d && d.trim())
        : (destination ? [destination] : []);

    const checkQuery = 'SELECT * FROM trips WHERE id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [tripId, userId]);

    if (checkResult.rows.length === 0) {
        throw new Error('Trip not found');
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const query = `
            UPDATE trips 
            SET start_date = COALESCE($1, start_date),
                end_date = COALESCE($2, end_date),
                budget = COALESCE($3, budget),
                currency = COALESCE($4, currency)
            WHERE id = $5 AND user_id = $6
            RETURNING *
        `;
        const result = await client.query(query, [start_date, end_date, budget, currency, tripId, userId]);
        const updatedTrip = result.rows[0];

        if (destList.length > 0) {
            // Clear existing destinations and re-insert
            await client.query('DELETE FROM trip_destinations WHERE trip_id = $1', [tripId]);

            for (let i = 0; i < destList.length; i++) {
                const destName = destList[i];
                let destId;
                const destResult = await client.query('SELECT id FROM destinations WHERE city_name = $1', [destName]);
                if (destResult.rows.length > 0) {
                    destId = destResult.rows[0].id;
                } else {
                    const newDest = await client.query('INSERT INTO destinations (city_name, country_name) VALUES ($1, $2) RETURNING id', [destName, 'Unknown']);
                    destId = newDest.rows[0].id;
                }
                await client.query('INSERT INTO trip_destinations (trip_id, destination_id, visit_order) VALUES ($1, $2, $3)', [tripId, destId, i + 1]);
            }
        }

        await client.query('COMMIT');
        updatedTrip.destination = destList[0] || null;
        updatedTrip.destinations = destList;
        return updatedTrip;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

const deleteTrip = async (userId, tripId, checklistAction = 'move_to_general') => {
    const checkQuery = 'SELECT * FROM trips WHERE id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [tripId, userId]);

    if (checkResult.rows.length === 0) {
        throw new Error('Trip not found');
    }

    if (checklistAction === 'delete_items') {
        await pool.query('DELETE FROM custom_checklists WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
    } else {
        await pool.query('UPDATE custom_checklists SET trip_id = NULL WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
    }

    const query = 'DELETE FROM trips WHERE id = $1 AND user_id = $2';
    await pool.query(query, [tripId, userId]);
};

const getChecklistCount = async (userId, tripId) => {
    const query = 'SELECT COUNT(*) as count FROM checklist_items ci JOIN custom_checklists cc ON ci.checklist_id = cc.id WHERE cc.user_id = $1 AND cc.trip_id = $2';
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
