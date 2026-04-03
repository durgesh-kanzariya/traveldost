import api from './api';

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await api.put('/auth/profile', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await api.put('/auth/password', passwordData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update password');
    }
};
