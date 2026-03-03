import { API_URL, getHeaders } from './api';

const getCache = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data).value : null;
    } catch { return null; }
};

const setCache = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify({ value, time: Date.now() }));
    } catch { }
};

const clearCache = (key) => {
    localStorage.removeItem(key);
};

export const getTrips = async () => {
    try {
        const res = await fetch(`${API_URL}/api/trips`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setCache('trips', data);
        return data;
    } catch {
        return getCache('trips') || [];
    }
};

export const getUpcomingTrip = async () => {
    try {
        const res = await fetch(`${API_URL}/api/trips/upcoming`, { headers: getHeaders() });
        return res.ok ? await res.json() : null;
    } catch { return null; }
};

export const createTrip = async (tripData) => {
    const res = await fetch(`${API_URL}/api/trips`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(tripData),
    });
    if (!res.ok) throw new Error('Failed');
    clearCache('trips');
    return await res.json();
};

export const deleteTrip = async (tripId, action = 'move_to_general') => {
    const res = await fetch(`${API_URL}/api/trips/${tripId}?checklistAction=${action}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed');
    clearCache('trips');
    return await res.json();
};

export const updateTrip = async (tripId, tripData) => {
    const res = await fetch(`${API_URL}/api/trips/${tripId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(tripData),
    });
    if (!res.ok) throw new Error('Failed to update trip');
    clearCache('trips');
    return await res.json();
};

export const getChecklistCount = async (tripId) => {
    try {
        const res = await fetch(`${API_URL}/api/trips/${tripId}/checklist-count`, { headers: getHeaders() });
        return res.ok ? (await res.json()).count : 0;
    } catch { return 0; }
};
