const User = require('../models/User');
const CountryGuide = require('../models/CountryGuide');

/**
 * Get all users registered in the system
 */
exports.getAllUsers = async () => {
    return await User.findAll();
};

/**
 * Delete a user by ID
 * @param {string|number} id - User ID
 */
exports.deleteUser = async (id) => {
    const deletedUser = await User.delete(id);
    if (!deletedUser) {
        throw new Error('User not found');
    }
    return deletedUser;
};

/**
 * Get overall system statistics
 */
exports.getStats = async () => {
    const userCount = await User.count();
    const guideCount = await CountryGuide.count();

    return {
        totalUsers: userCount,
        totalGuides: guideCount,
        reports: 0 // Placeholder until Report model is implemented
    };
};

/**
 * Get all country guides
 */
exports.getAllGuides = async () => {
    return await CountryGuide.findAll();
};

/**
 * Create a new country guide
 * @param {Object} data - Guide data
 */
exports.createGuide = async (data) => {
    return await CountryGuide.create(data);
};

/**
 * Update an existing country guide
 * @param {string|number} id - Guide ID
 * @param {Object} data - Updated data
 */
exports.updateGuide = async (id, data) => {
    const updatedGuide = await CountryGuide.update(id, data);
    if (!updatedGuide) {
        throw new Error('Guide not found');
    }
    return updatedGuide;
};

/**
 * Delete a country guide
 * @param {string|number} id - Guide ID
 */
exports.deleteGuide = async (id) => {
    const deletedGuide = await CountryGuide.delete(id);
    if (!deletedGuide) {
        throw new Error('Guide not found');
    }
    return deletedGuide;
};
