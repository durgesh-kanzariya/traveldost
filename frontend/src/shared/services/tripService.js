import api from './api';

const getCache = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data).value : null;
    } catch { return null; }
};

const setCache = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify({ value, time: Date.now() }));
    } catch { /* ignore */ }
};

const clearCache = (key) => {
    localStorage.removeItem(key);
};

export const getTrips = async () => {
    try {
        const res = await api.get('/trips');
        const data = res.data;
        setCache('trips', data);
        return data;
    } catch {
        return getCache('trips') || [];
    }
};

export const getUpcomingTrip = async () => {
    try {
        const res = await api.get('/trips/upcoming');
        return res.data;
    } catch { return null; }
};

export const createTrip = async (tripData) => {
    const res = await api.post('/trips', tripData);
    clearCache('trips');
    return res.data;
};

export const deleteTrip = async (tripId, action = 'move_to_general') => {
    const res = await api.delete(`/trips/${tripId}?checklistAction=${action}`);
    clearCache('trips');
    return res.data;
};

export const updateTrip = async (tripId, tripData) => {
    const res = await api.put(`/trips/${tripId}`, tripData);
    clearCache('trips');
    return res.data;
};

export const getChecklistCount = async (tripId) => {
    try {
        const res = await api.get(`/trips/${tripId}/checklist-count`);
        return res.data.count;
    } catch { return 0; }
};
