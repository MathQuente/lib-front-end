import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'
export const tokenProvider = () => ({
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken')
  },
  getAccessToken: () => {
    return localStorage.getItem('accessToken')
  },
  setAccessToken: (acessToken: string) => {
    localStorage.setItem('accessToken', acessToken)
  },
  setRefreshToken: (token: string) => {
    localStorage.setItem('refreshToken', token)
  },
  removeTokens: () => {
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
  },
  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      if (!decoded.exp) return true
      // Adiciona uma margem de 30 segundos para evitar problemas de timing
      return decoded.exp <= Date.now()
    } catch {
      return true
    }
  },
  isTokenCloseToExpire: (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      if (!decoded.exp) return true
      // Adiciona uma margem de 30 segundos para evitar problemas de timing
      return decoded.exp * 1000 <= Date.now() + 3000
    } catch {
      return true
    }
  },
  extractUserFromToken: (accessToken: string | null) => {
    try {
      const decoded = jwtDecode<JwtPayload & { userId?: string }>(
        accessToken || ''
      )

      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        return null
      }

      return {
        id: decoded.userId
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }
})
