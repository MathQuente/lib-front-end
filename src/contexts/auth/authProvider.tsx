import { useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from './authContext'
import type { User } from '../../types/user'
import { api } from '../../hooks/useApi'
import Cookies from 'js-cookie'

// const redirectToAuth = () => {
//   window.location.href = '/auth'
// }

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<Partial<User> | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)
      const loggedUser = response.user
      setUser(loggedUser)
      return true
    } catch {
      return false
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      const { user: newUser } = await api.signup(email, password)
      setUser(newUser)
      return null
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message
        if (message === 'This email is already used') {
          return 'Este e-mail já está em uso.'
        }
        if (message) return message
      }
      return 'Não foi possível criar a conta. Tente novamente.'
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
    }
    setUser(null)
  }

  const checkAuth = async () => {
    setLoading(true)

    try {
      const hasAccessToken = Cookies.get('accessToken')
      const hasRefreshToken = Cookies.get('refreshToken')

      if (!hasAccessToken && !hasRefreshToken) {
        setUser(null)
        return
      }
      const { user: currentUser } = await api.me()
      setUser(currentUser)
    } catch {
      setUser(null)
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
    } finally {
      setLoading(false)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
