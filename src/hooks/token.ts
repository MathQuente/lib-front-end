import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  userId: string
}

export const tokenProvider = () => ({
  getToken: () => {
    const token = localStorage.getItem('authToken')
    return token
  },
  setToken: (token: string) => {
    localStorage.setItem('authToken', token)
  },
  removeToken: () => {
    localStorage.removeItem('authToken')
  },
  isTokenValid: () => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      return false
    }

    const decoded = jwtDecode<JwtPayload>(token)
    if (!decoded) {
      return false
    }

    return true
  }
})
