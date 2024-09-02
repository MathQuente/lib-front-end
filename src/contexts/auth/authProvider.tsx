import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { User } from '../../types/user'
import { useApi } from '../../hooks/useApi'

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User | null>(null)
  const api = useApi()

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password)
    if (data.user && data.token) {
      setUser(data.user)
      setToken(data.token)
      return true
    }
    return false
  }

  const signup = async (email: string, password: string) => {
    const data = await api.signup(email, password)
    if (data.user && data.token) {
      setUser(data.user)
      setToken(data.token)
      return true
    }
    return false
  }

  const logout = async () => {
    await api.logout()
    setUser(null)
    removeToken()
  }

  const setToken = (token: string) => {
    localStorage.setItem('authToken', token)
  }

  const removeToken = () => {
    localStorage.removeItem('authToken')
  }

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        const userData = await api.getCurrentUser(token)
        if (userData) {
          setUser(userData)
        } else {
          removeToken()
        }
      }
    }
    checkToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}
