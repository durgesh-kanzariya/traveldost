const tripService = require('../services/tripService');

// GET all trips for a user
exports.getTrips = async (req, res) => {
    try {
        const userId = req.user.id;
        const trips = await tripService.getTripsByUser(userId);
        res.json(trips);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET upcoming trip
exports.getUpcomingTrip = async (req, res) => {
    try {
        const userId = req.user.id;
        const trip = await tripService.getUpcomingTrip(userId);
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET checklist count for a trip
exports.getChecklistCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const tripId = req.params.id;
        const count = await tripService.getChecklistCount(userId, tripId);
        res.json({ count });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST a new trip
exports.createTrip = async (req, res) => {
    try {
        const userId = req.user.id;
        const { destinations, destination, start_date, end_date, budget, currency } = req.body;
        const trip = await tripService.createTrip(userId, { destinations, destination, start_date, end_date, budget, currency });
        res.status(201).json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// PUT update a trip
exports.updateTrip = async (req, res) => {
    try {
        const userId = req.user.id;
        const tripId = req.params.id;
        const { destinations, destination, start_date, end_date, budget, currency } = req.body;
        const trip = await tripService.updateTrip(userId, tripId, { destinations, destination, start_date, end_date, budget, currency });
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Trip not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE a trip
exports.deleteTrip = async (req, res) => {
    try {
        const userId = req.user.id;
        const tripId = req.params.id;
        const { checklistAction } = req.query;

        await tripService.deleteTrip(userId, tripId, checklistAction);
        res.json({ message: 'Trip deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Trip not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};
