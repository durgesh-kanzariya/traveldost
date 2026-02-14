import { API_URL, getHeaders } from './api';

export const getChecklistItems = async () => {
    const response = await fetch(`${API_URL}/api/checklist`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch checklist');
    return await response.json();
};

export const addChecklistItem = async (label) => {
    const response = await fetch(`${API_URL}/api/checklist`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ label }),
    });
    if (!response.ok) throw new Error('Failed to add item');
    return await response.json();
};

export const updateChecklistItem = async (id, checked) => {
    const response = await fetch(`${API_URL}/api/checklist/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ checked }),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return await response.json();
};

export const deleteChecklistItem = async (id) => {
    const response = await fetch(`${API_URL}/api/checklist/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete item');
    return await response.json();
};
