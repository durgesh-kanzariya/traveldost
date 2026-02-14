import { API_URL } from './api';

export const getAllGuides = async () => {
    const response = await fetch(`${API_URL}/api/guides/list`);
    if (!response.ok) throw new Error('Failed to fetch guide list');
    return await response.json();
};

export const getGuideByCountry = async (countryName) => {
    const response = await fetch(`${API_URL}/api/guides/${countryName}`);
    if (!response.ok) throw new Error('Failed to fetch country guide');
    return await response.json();
};
