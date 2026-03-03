import { API_URL, getHeaders } from './api';

export const getExpenses = async (tripId) => {
    const res = await fetch(`${API_URL}/api/expenses/trip/${tripId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch expenses');
    return await res.json();
};

export const getExpenseSummary = async (tripId) => {
    const res = await fetch(`${API_URL}/api/expenses/trip/${tripId}/summary`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch summary');
    return await res.json();
};

export const addExpense = async (expenseData) => {
    const res = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(expenseData),
    });
    if (!res.ok) throw new Error('Failed to add expense');
    return await res.json();
};

export const deleteExpense = async (id) => {
    const res = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete expense');
    return await res.json();
};
