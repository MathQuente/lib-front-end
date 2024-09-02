import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

interface JwtPayload {
  userId: string
}

export const useApi = () => ({
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password })
    return response.data
  },
  signup: async (email: string, password: string) => {
    const response = await api.post('/users', { email, password })
    return response.data
  },
  logout: async () => {
    const token = localStorage.getItem('authToken')

    try {
      await api.post(
        '/users/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } catch (error) {
      console.error('Logout failed:', error)
    }
  },
  getCurrentUser: async (token: string) => {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },
  getUserIdFromToken: (): string | null => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        return decoded.userId
      } catch (error) {
        console.error('Invalid token:', error)
        return null
      }
    }
    return null
  },
  getUserGames: async (userId: string) => {
    const token = localStorage.getItem('authToken')
    const response = await api.get(`/users/${userId}/userGames`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },
  getUserProfile: async (userId: string) => {
    const token = localStorage.getItem('authToken')
    const response = await api.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
})
