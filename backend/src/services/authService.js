const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const registerUser = async ({ firstName, lastName, email, password, nativeLanguage }) => {
    // 1. Check if user exists (Delegated to Model)
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // 2. Hash Password (Business Logic)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User (Delegated to Model)
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        nativeLanguage
    });

    // 4. Generate Token (Business Logic)
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return {
        token,
        user: {
            id: newUser.id,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            email: newUser.email,
            nativeLanguage: newUser.native_language,
            defaultCurrency: newUser.default_currency || 'INR',
            role: newUser.role
        }
    };
};

const loginUser = async ({ email, password }) => {
    // 1. Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
        throw new Error('Invalid Credentials');
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid Credentials');
    }

    // 3. Generate Token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return {
        token,
        user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            nativeLanguage: user.native_language,
            defaultCurrency: user.default_currency,
            role: user.role
        }
    };
};

const updateUserProfile = async (userId, { firstName, lastName, email, nativeLanguage, defaultCurrency }) => {
    return await User.update(userId, { firstName, lastName, email, nativeLanguage, defaultCurrency });
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error('Incorrect old password');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updatePassword(userId, hashedPassword);
    return { message: 'Password updated successfully' };
};

module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    changePassword
};
