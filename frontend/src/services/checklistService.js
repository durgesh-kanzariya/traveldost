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
    } catch {}
};

const clearCache = () => {
    localStorage.removeItem('checklist');
};

const getChecklistItems = async (tripId) => {
    let url = `${API_URL}/api/checklist`;
    if (tripId === null) url += '?trip_id=null';
    else if (tripId) url += `?trip_id=${tripId}`;
    
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
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
    const res = await fetch(`${API_URL}/api/checklist`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ label, trip_id: tripId }),
    });
    if (!res.ok) throw new Error('Failed');
    clearCache();
    return await res.json();
};

export const updateChecklistItem = async (id, checked) => {
    const res = await fetch(`${API_URL}/api/checklist/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ checked }),
    });
    if (!res.ok) throw new Error('Failed');
    clearCache();
    return await res.json();
};

export const deleteChecklistItem = async (id) => {
    const res = await fetch(`${API_URL}/api/checklist/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed');
    clearCache();
    return await res.json();
};
