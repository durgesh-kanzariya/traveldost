const Trip = require('../models/Trip');
const Destination = require('../models/Destination');
const pool = require('../config/db');

const getTripsByUser = async (userId, pagination) => {
    return await Trip.findAllByUserId(userId, pagination);
};

const getUpcomingTrip = async (userId) => {
    return await Trip.findUpcomingByUserId(userId);
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

        const newTrip = await Trip.create({ userId, start_date, end_date, budget, currency }, client);

        for (let i = 0; i < destList.length; i++) {
            const destName = destList[i];
            const destId = await Destination.findOrCreate(destName, client);
            await Trip.addDestination(newTrip.id, destId, i + 1, client);
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

    const trip = await Trip.findByIdAndUserId(tripId, userId);
    if (!trip) {
        throw new Error('Trip not found');
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const updatedTrip = await Trip.update(tripId, userId, { start_date, end_date, budget, currency }, client);

        if (destList.length > 0) {
            await Trip.clearDestinations(tripId, client);

            for (let i = 0; i < destList.length; i++) {
                const destName = destList[i];
                const destId = await Destination.findOrCreate(destName, client);
                await Trip.addDestination(tripId, destId, i + 1, client);
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Verify trip ownership within the same transaction using FOR UPDATE lock
        const tripCheck = await client.query(
            'SELECT id FROM trips WHERE id = $1 AND user_id = $2 FOR UPDATE',
            [tripId, userId]
        );
        if (tripCheck.rowCount === 0) {
            const err = new Error('Trip not found');
            err.statusCode = 404;
            throw err;
        }

        if (checklistAction === 'delete_items') {
            await client.query('DELETE FROM custom_checklists WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
        } else {
            await client.query('UPDATE custom_checklists SET trip_id = NULL WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
        }

        await client.query('DELETE FROM trips WHERE id = $1 AND user_id = $2', [tripId, userId]);

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

const getChecklistCount = async (userId, tripId) => {
    return await Trip.getChecklistCount(userId, tripId);
};

module.exports = {
    getTripsByUser,
    getUpcomingTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    getChecklistCount
};
