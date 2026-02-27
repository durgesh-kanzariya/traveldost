import { API_URL } from './api';

const CACHE_DAYS = 7;

const getCache = (key) => {
    try {
        const data = localStorage.getItem(key);
        if (!data) return null;
        const parsed = JSON.parse(data);
        if (Date.now() - parsed.time > CACHE_DAYS * 24 * 60 * 60 * 1000) {
            return null;
        }
        return parsed.value;
    } catch { return null; }
};

const setCache = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify({ value, time: Date.now() }));
    } catch {}
};

export const getGuideByCountry = async (countryName) => {
    const cached = getCache(`guide_${countryName}`);
    if (cached) return cached;
    
    const res = await fetch(`${API_URL}/api/guides/${countryName}`);
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    setCache(`guide_${countryName}`, data);
    return data;
};

export const getAllGuides = async () => {
    const cached = getCache('guides_list');
    if (cached) return cached;
    
    const res = await fetch(`${API_URL}/api/guides/list`);
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    setCache('guides_list', data);
    return data;
};
