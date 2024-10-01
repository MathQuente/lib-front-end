import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import type { User } from '../../types/user'
import { useApi } from '../../hooks/useApi'
import { tokenProvider } from '../../hooks/token'

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const api = useApi()
  const tokenService = tokenProvider()

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password)
    if (data.user && data.token) {
      setUser(data.user)
      tokenService.setToken(data.token)
      return true
    }
    return false
  }

  const signup = async (email: string, password: string) => {
    const data = await api.signup(email, password)
    if (data.user && data.token) {
      setUser(data.user)
      tokenService.setToken(data.token)
      return true
    }
    return false
  }

  const logout = async () => {
    await api.logout()
    setUser(null)
    tokenService.removeToken()
  }
  const checkToken = async () => {
    setLoading(true)
    const token = localStorage.getItem('authToken')
    if (!token) {
      tokenService.removeToken()
      setLoading(false)
      return
    }

    try {
      const userData = await api.getCurrentUser(token)
      if (userData) {
        setUser(userData)
      } else {
        tokenService.removeToken()
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error) // opcional: log do erro para depuração
      tokenService.removeToken()
    } finally {
      setLoading(false)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies(checkToken): <explanation>
  useEffect(() => {
    checkToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
