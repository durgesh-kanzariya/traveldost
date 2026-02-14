import { Navigate } from 'react-router-dom'

export function AdminRoute({ children }) {
    // 1. Get Token & User Data
    const token = localStorage.getItem('token')
    let user = {}
    try {
        user = JSON.parse(localStorage.getItem('user') || '{}')
    } catch (e) {
        console.error("Failed to parse user data in AdminRoute", e)
        localStorage.removeItem('user') // Clear corrupted data
    }

    // 2. Check if logged in
    if (!token) {
        return <Navigate to="/login" replace />
    }

    // 3. Check if Admin
    if (user.role !== 'admin') {
        // Redirect normal users to their dashboard
        return <Navigate to="/dashboard" replace />
    }

    // 4. Allow access
    return children
}
