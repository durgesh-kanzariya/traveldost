import { api } from '../../shared/services';

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

const clearCache = () => {
    localStorage.removeItem('checklist');
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
