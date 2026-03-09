const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, nativeLanguage } = req.body;
        const result = await authService.registerUser({ firstName, lastName, email, password, nativeLanguage });
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'User already exists') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser({ email, password });
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Invalid Credentials') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, nativeLanguage, defaultCurrency } = req.body;
        const updatedUser = await authService.updateUserProfile(req.user.id, { firstName, lastName, email, nativeLanguage, defaultCurrency });
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await authService.changePassword(req.user.id, { oldPassword, newPassword });
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Incorrect old password') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    register,
    login,
    updateProfile,
    changePassword
};
