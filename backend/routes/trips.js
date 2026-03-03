const express = require('express');
const router = express.Router();
const tripService = require('../services/tripService');

router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const trips = await tripService.getTripsByUser(userId);
        res.json(trips);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/upcoming', async (req, res) => {
    try {
        const userId = req.user.id;
        const trip = await tripService.getUpcomingTrip(userId);
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/:id/checklist-count', async (req, res) => {
    try {
        const userId = req.user.id;
        const tripId = req.params.id;
        const count = await tripService.getChecklistCount(userId, tripId);
        res.json({ count });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { destinations, destination, start_date, end_date, budget, currency } = req.body;
        const trip = await tripService.createTrip(userId, { destinations, destination, start_date, end_date, budget, currency });
        res.status(201).json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/:id', async (req, res) => {
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
});

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const tripId = req.params.id;
        const { checklistAction } = req.query; // 'move_to_general' or 'delete_items'

        await tripService.deleteTrip(userId, tripId, checklistAction);
        res.json({ message: 'Trip deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Trip not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
