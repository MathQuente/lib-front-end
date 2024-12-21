import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import type { User } from '../../types/user'
import { useApi } from '../../hooks/useApi'
import { tokenProvider } from '../../hooks/token'

type tokenResponse = {
  accessToken: string
  refreshToken: string
}

const redirectToAuth = () => {
  window.location.href = '/auth'
}

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<Partial<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const api = useApi()
  const tokenService = tokenProvider()

  const handleTokens = (tokens: tokenResponse) => {
    tokenService.setAccessToken(tokens.accessToken)
    tokenService.setRefreshToken(tokens.refreshToken)
  }

  const validateAndSetUser = (accessToken: string) => {
    const userData = tokenService.extractUserFromToken(accessToken)
    if (userData) {
      setUser(userData)
      return true
    }
    return false
  }

  const isAuthRoute = () => {
    return window.location.pathname.includes('/auth')
  }

  const handleFailedAuth = () => {
    setUser(null)
    tokenService.removeTokens()
    if (!isAuthRoute()) {
      redirectToAuth()
    }
  }

  const refreshUserToken = async (refreshToken: string) => {
    const newTokens = await api.refreshToken(refreshToken)
    if (!newTokens) {
      throw new Error('Could not refresh token')
    }

    handleTokens(newTokens)
    const userData = tokenService.extractUserFromToken(newTokens.accessToken)

    if (!userData) {
      throw new Error('Invalid token after refresh')
    }

    setUser(userData)
  }

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password)
    if (data?.accessToken && data?.refreshToken) {
      tokenService.setRefreshToken(data.refreshToken)
      localStorage.setItem('accessToken', data.accessToken)

      const userData = tokenService.extractUserFromToken(data.accessToken)
      if (userData) {
        setUser(userData)
        return true
      }
      logout()
    }
    return false
  }

  const signup = async (email: string, password: string) => {
    const data = await api.signup(email, password)
    if (data.user && data.token) {
      setUser(data.user)
      tokenService.setRefreshToken(data.token)
      return true
    }
    return false
  }

  const logout = async () => {
    await api.logout()
    setUser(null)
    tokenService.removeTokens()
  }

  const checkToken = async () => {
    setLoading(true)
    try {
      const refreshToken = tokenService.getRefreshToken()
      const accessToken = tokenService.getAccessToken()

      if (!refreshToken || !accessToken) {
        handleFailedAuth()
        return
      }

      if (tokenService.isTokenCloseToExpire(refreshToken)) {
        handleFailedAuth()
        return
      }

      if (validateAndSetUser(accessToken)) {
        return
      }

      if (tokenService.isTokenCloseToExpire(accessToken)) {
        await refreshUserToken(refreshToken)
        return
      }

      if (tokenService.isTokenExpired(accessToken)) {
        await api.logout()
        handleFailedAuth()
        return
      }
    } catch (error) {
      console.error('Error checking token:', error)
      setUser(null)
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
