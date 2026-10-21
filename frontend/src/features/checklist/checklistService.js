import { api } from '../../shared/services';

const CHECKLIST_CACHE_TTL = 15 * 60 * 1000; // 15 minutes TTL

const getCache = (key) => {
    try {
        const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.time > CHECKLIST_CACHE_TTL) {
            return null; // Expired cache
        }
        return parsed.value;
    } catch {
        return null;
    }
};

const setCache = (key, value) => {
    try {
        sessionStorage.setItem(key, JSON.stringify({ value, time: Date.now() }));
    } catch { /* ignore quota */ }
};

const clearCache = () => {
    try {
        sessionStorage.removeItem('checklist_all');
        for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);
            if (k && k.startsWith('checklist_')) {
                sessionStorage.removeItem(k);
            }
        }
    } catch { /* ignore */ }
};

const getChecklistItems = async (tripId) => {
    let url = '/checklist';
    if (tripId === null) url += '?trip_id=null';
    else if (tripId) url += `?trip_id=${tripId}`;

    const res = await api.get(url);
    return res.data;
};

export const getChecklistItemsByTrip = async (tripId) => {
    const key = `checklist_${tripId || 'all'}`;
    try {
        const data = await getChecklistItems(tripId);
        setCache(key, data);
        return data;
    } catch {
        return getCache(key) || [];
    }
};

export const addChecklistItem = async (label, tripId) => {
    const res = await api.post('/checklist', { label, tripId });
    clearCache();
    return res.data;
};

export const updateChecklistItem = async (id, checked) => {
    const res = await api.put(`/checklist/${id}`, { checked });
    clearCache();
    return res.data;
};

export const deleteChecklistItem = async (id) => {
    const res = await api.delete(`/checklist/${id}`);
    clearCache();
    return res.data;
};
