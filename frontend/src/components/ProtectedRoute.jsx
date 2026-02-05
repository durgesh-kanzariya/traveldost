import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }) {
  // 1. Check if the token exists in the browser's safe
  const token = localStorage.getItem('token')

  // 2. If NO token, kick them out to the Login page
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 3. If YES token, let them see the page
  return children
}