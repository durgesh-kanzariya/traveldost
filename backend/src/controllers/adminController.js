const adminService = require('../services/adminService');

const getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await adminService.deleteUser(id);
        res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (err) {
        console.error(err.message);
        if (err.message === 'User not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await adminService.getStats();
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllGuides = async (req, res) => {
    try {
        const guides = await adminService.getAllGuides();
        res.json(guides);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createGuide = async (req, res) => {
    try {
        const newGuide = await adminService.createGuide(req.body);
        res.json(newGuide);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedGuide = await adminService.updateGuide(id, req.body);
        res.json(updatedGuide);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Guide not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteGuide = async (req, res) => {
    try {
        const { id } = req.params;
        await adminService.deleteGuide(id);
        res.json({ message: 'Guide deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Guide not found') {
            return res.status(404).json({ message: err.message });
        }
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
