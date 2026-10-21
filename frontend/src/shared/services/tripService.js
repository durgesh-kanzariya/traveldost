import api from './api';

const TRIP_CACHE_KEY = 'traveldost_trips_cache';
const TRIP_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

const getCache = (key) => {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.time || (Date.now() - parsed.time > TRIP_CACHE_TTL_MS)) {
            sessionStorage.removeItem(key);
            return null;
        }
        return parsed.value;
    } catch {
        return null;
    }
};

const setCache = (key, value) => {
    try {
        sessionStorage.setItem(key, JSON.stringify({ value, time: Date.now() }));
    } catch { /* ignore */ }
};

const clearCache = (key) => {
    try {
        sessionStorage.removeItem(key);
    } catch { /* ignore */ }
};

export const getTrips = async () => {
    try {
        const res = await api.get('/trips');
        const data = res.data;
        setCache(TRIP_CACHE_KEY, data);
        return data;
    } catch (err) {
        const cached = getCache(TRIP_CACHE_KEY);
        if (cached && Array.isArray(cached)) {
            const tagged = cached.map(trip => ({ ...trip, isOfflineCache: true }));
            tagged.isOfflineCache = true;
            return tagged;
        }
        throw err;
    }
};

export const getUpcomingTrip = async () => {
    try {
        const res = await api.get('/trips/upcoming');
        return res.data;
    } catch {
        return null;
    }
};

export const createTrip = async (tripData) => {
    const res = await api.post('/trips', tripData);
    clearCache(TRIP_CACHE_KEY);
    return res.data;
};

export const deleteTrip = async (tripId, action = 'move_to_general') => {
    const res = await api.delete(`/trips/${tripId}?checklistAction=${action}`);
    clearCache(TRIP_CACHE_KEY);
    return res.data;
};

export const updateTrip = async (tripId, tripData) => {
    const res = await api.put(`/trips/${tripId}`, tripData);
    clearCache(TRIP_CACHE_KEY);
    return res.data;
};

export const getChecklistCount = async (tripId) => {
    try {
        const res = await api.get(`/trips/${tripId}/checklist-count`);
        return res.data.count;
    } catch {
        return 0;
    }
};
