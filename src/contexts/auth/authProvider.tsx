import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { isAxiosError } from 'axios'
import { AuthContext } from './authContext'
import type { User } from '../../types/user'
import { api, SESSION_ENDED_EVENT } from '../../hooks/useApi'
import { getErrorMessage } from '../../utils/getErrorMessage'

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
      const isPasswordError =
        isAxiosError(error) &&
        typeof error.response?.data?.error?.password?.[0] === 'string'
      return {
        field: isPasswordError ? ('password' as const) : ('email' as const),
        message: getErrorMessage(
          error,
          'Não foi possível criar a conta. Tente novamente.'
        )
      }
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch {}
    setUser(null)
  }

  const checkAuth = async () => {
    setLoading(true)

    try {
      const { user: currentUser } = await api.me()
      setUser(currentUser)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const userRef = useRef(user)
  userRef.current = user

  useEffect(() => {
    const handleSessionEnded = () => {
      if (!userRef.current) return
      setUser(null)
      toast.info('Sua sessão terminou. Entre novamente.')
    }

    window.addEventListener(SESSION_ENDED_EVENT, handleSessionEnded)
    return () =>
      window.removeEventListener(SESSION_ENDED_EVENT, handleSessionEnded)
  }, [])

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
