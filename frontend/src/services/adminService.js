import { API_URL, getHeaders } from './api'

// Get All Users
export const getAllUsers = async () => {
    const response = await fetch(`${API_URL}/api/admin/users`, {
        method: 'GET',
        headers: getHeaders(),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch users')
    }

    return await response.json()
}

// Delete User
export const deleteUser = async (userId) => {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete user')
    }

    return await response.json()
}

// Get System Stats (For Dashboard)
export const getSystemStats = async () => {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
        method: 'GET',
        headers: getHeaders(),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch stats')
    }

    return await response.json()
}

// --- GUIDE MANAGEMENT ---

export const getAllGuides = async () => {
    const response = await fetch(`${API_URL}/api/admin/guides`, {
        method: 'GET',
        headers: getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch guides')
    return await response.json()
}

export const createGuide = async (data) => {
    const response = await fetch(`${API_URL}/api/admin/guides`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create guide')
    return await response.json()
}

export const updateGuide = async (id, data) => {
    const response = await fetch(`${API_URL}/api/admin/guides/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update guide')
    return await response.json()
}

export const deleteGuide = async (id) => {
    const response = await fetch(`${API_URL}/api/admin/guides/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete guide')
    return await response.json()
}
