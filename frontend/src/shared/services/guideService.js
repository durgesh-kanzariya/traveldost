import api from './api';

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
    } catch { /* ignore */ }
};

export const getGuideByCountry = async (countryName) => {
    const cached = getCache(`guide_${countryName}`);
    if (cached) return cached;

    const res = await api.get(`/guides/${countryName}`);
    const data = res.data;
    setCache(`guide_${countryName}`, data);
    return data;
};

export const getAllGuides = async () => {
    const cached = getCache('guides_list');
    if (cached) return cached;

    const res = await api.get('/guides/list');
    const data = res.data;
    setCache('guides_list', data);
    return data;
};
