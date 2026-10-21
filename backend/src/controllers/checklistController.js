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
        if (err.statusCode === 404 || err.message === 'Trip not found') {
            return res.status(404).json({ message: 'Trip not found' });
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
        if (err.statusCode === 404 || err.message === 'Checklist item not found') {
            return res.status(404).json({ message: 'Checklist item not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await checklistService.deleteItem(id, req.user.id);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.statusCode === 404 || err.message === 'Checklist item not found') {
            return res.status(404).json({ message: 'Checklist item not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getItems,
    addItem,
    updateItem,
    deleteItem
};
