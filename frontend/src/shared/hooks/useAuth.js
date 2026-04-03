import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('nativeLanguage')
    navigate('/login')
  }

  const getUser = () => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  }

  const getToken = () => {
    return localStorage.getItem('token')
  }

  const isAdmin = () => {
    const user = getUser()
    return user?.role === 'admin'
  }

  return { logout, getUser, getToken, isAdmin }
}
