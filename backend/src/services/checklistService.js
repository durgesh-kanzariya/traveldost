const Checklist = require('../models/Checklist');

const getItems = async (userId, tripId = null) => {
    return await Checklist.findAllByUserId(userId, tripId);
};

const addItem = async (userId, label, tripId = null) => {
    if (!label) {
        throw new Error('Label is required');
    }
    return await Checklist.create(userId, label, tripId);
};

const updateItem = async (id, userId, checked) => {
    return await Checklist.update(id, userId, checked);
};

const deleteItem = async (id, userId) => {
    return await Checklist.delete(id, userId);
};

module.exports = {
    getItems,
    addItem,
    updateItem,
    deleteItem
};
