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

const getStats = async (req, res) => {
    try {
        const users = await User.findAll();
        // Placeholder for guides count until Guide model is fully implemented
        const stats = {
            totalUsers: users.length,
            totalGuides: 0 // To be updated
        };
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getStats
};
