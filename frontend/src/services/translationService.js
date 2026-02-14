import { API_URL } from './api';

export const translateText = async (text, from, to) => {
    const response = await fetch(`${API_URL}/api/translate?text=${encodeURIComponent(text)}&from=${from}&to=${to}`);
    if (!response.ok) throw new Error('Translation failed');
    return await response.json();
};
