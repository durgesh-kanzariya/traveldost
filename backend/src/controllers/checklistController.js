const checklistService = require('../services/checklistService');

const getItems = async (req, res) => {
    try {
        let tripId = req.query.trip_id;
        if (tripId === 'null') {
            tripId = null;
        } else if (tripId) {
            tripId = parseInt(tripId, 10);
        }
        const items = await checklistService.getItems(req.user.id, tripId);
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const addItem = async (req, res) => {
    try {
        const { label, tripId } = req.body;
        const finalTripId = tripId === '' ? null : tripId;
        const newItem = await checklistService.addItem(req.user.id, label, finalTripId);
        res.json(newItem);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Label is required') {
            return res.status(400).send(err.message);
        }
        res.status(500).send('Server Error');
    }
};

const updateItem = async (req, res) => {
    try {
        const { checked } = req.body;
        const { id } = req.params;
        const result = await checklistService.updateItem(id, req.user.id, checked);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await checklistService.deleteItem(id, req.user.id);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getItems,
    addItem,
    updateItem,
    deleteItem
};
