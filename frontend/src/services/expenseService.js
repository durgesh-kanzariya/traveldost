import api from './api';

export const getExpenses = async (tripId) => {
    const res = await api.get(`/expenses/trip/${tripId}`);
    return res.data;
};

export const getExpenseSummary = async (tripId) => {
    const res = await api.get(`/expenses/trip/${tripId}/summary`);
    return res.data;
};

export const addExpense = async (expenseData) => {
    const res = await api.post('/expenses', expenseData);
    return res.data;
};

export const deleteExpense = async (id) => {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
};

