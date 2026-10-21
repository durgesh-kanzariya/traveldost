import { useNavigate } from 'react-router-dom'
import { clearAuth, getStoredUser, getAuthToken } from '../utils/authStorage'

export function useAuth() {
  const navigate = useNavigate()

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  const getUser = () => {
    return getStoredUser()
  }

  const getToken = () => {
    return getAuthToken()
  }

  const isAdmin = () => {
    const user = getUser()
    return user?.role === 'admin'
  }

  return { logout, getUser, getToken, isAdmin }
}
