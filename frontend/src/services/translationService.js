import api from './api'

export const translateText = async (text, from, to) => {
    const response = await api.get(`/translate?text=${encodeURIComponent(text)}&from=${from}&to=${to}`);
    return response.data;
};
