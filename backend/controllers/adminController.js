const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.delete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const CountryGuide = require('../models/CountryGuide');

const getStats = async (req, res) => {
    try {
        const userCount = await User.count();
        const guideCount = await CountryGuide.count();

        // Placeholder for reports count until Report model is fully implemented
        const stats = {
            totalUsers: userCount,
            totalGuides: guideCount,
            reports: 0
        };
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllGuides = async (req, res) => {
    try {
        const guides = await CountryGuide.findAll();
        res.json(guides);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createGuide = async (req, res) => {
    try {
        const newGuide = await CountryGuide.create(req.body);
        res.json(newGuide);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedGuide = await CountryGuide.update(id, req.body);

        if (!updatedGuide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        res.json(updatedGuide);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGuide = await CountryGuide.delete(id);

        if (!deletedGuide) {
            return res.status(440).json({ message: 'Guide not found' });
        }

        res.json({ message: 'Guide deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getStats,
    getAllGuides,
    createGuide,
    updateGuide,
    deleteGuide
};
