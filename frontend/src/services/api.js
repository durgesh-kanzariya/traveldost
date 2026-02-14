export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token })
    };
};
