import { API_URL, getHeaders } from './api';

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
};

export const updateUserProfile = async (userData) => {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Failed to update profile');
    }

    return await response.json();
};

export const changePassword = async (passwordData) => {
    const response = await fetch(`${API_URL}/api/auth/password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
    }

    return await response.json();
};
