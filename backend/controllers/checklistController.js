const checklistService = require('../services/checklistService');

// GET /
const getItems = async (req, res) => {
    try {
        const items = await checklistService.getItems(req.user.id);
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// POST /
const addItem = async (req, res) => {
    try {
        const { label } = req.body;
        const newItem = await checklistService.addItem(req.user.id, label);
        res.json(newItem);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Label is required') {
            return res.status(400).send(err.message);
        }
        res.status(500).send('Server Error');
    }
};

// PUT /:id
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

// DELETE /:id
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
