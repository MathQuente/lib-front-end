import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import { tokenProvider } from './token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

interface JwtPayload {
  userId: string
}

const tokenService = tokenProvider()

export const useApi = () => ({
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/users/login', { email, password })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message
        toast.error(errorMessage)
        return
      }

      toast.error('An unexpected error occurred. 🤯')
    }
  },
  signup: async (email: string, password: string) => {
    const response = await api.post('/users', { email, password })
    return response.data
  },
  logout: async () => {
    const token = tokenService.getToken()
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
  getUserGames: async (
    userId: string | null,
    page?: number,
    search?: string,
    filter?: number
  ) => {
    const token = localStorage.getItem('authToken')
    const response = await api.get(`/users/${userId}/userGames`, {
      params: {
        filter: filter,
        pageIndex: page ? page - 1 : undefined,
        query: search || undefined
      },
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },
  getUserProfile: async (userId: string | null) => {
    const token = localStorage.getItem('authToken')
    const response = await api.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },
  getGames: async (page: number, search: string) => {
    const response = await api.get('/games', {
      params: {
        pageIndex: page - 1,
        query: search || undefined
      }
    })
    return response.data
  },
  getGameStatus: async (userId: string | null, gameId: string | undefined) => {
    const token = localStorage.getItem('authToken')
    const response = await api.get(`/userGames/${userId}/${gameId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.UserGamesStatus
  },
  addGame: async (
    userId: string | null,
    gameId: string | undefined,
    statusId: string | undefined
  ) => {
    const token = localStorage.getItem('authToken')
    const response = await api.post(
      `/users/${userId}/userGames/${gameId}/${statusId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return response
  },
  updateGameStatus: async (
    userId: string | null,
    gameId: string | undefined,
    statusId: string | null | undefined
  ) => {
    const token = localStorage.getItem('authToken')
    const response = await api.patch(
      `/userGamesStatus/${userId}/${gameId}/${statusId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return response
  },
  removeGame: async (userId: string | null, gameId: string | undefined) => {
    const token = localStorage.getItem('authToken')
    const response = await api.delete(`/users/${userId}/userGames/${gameId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  },
  getUserGamesFinished: async (
    userId: string | null,
    page: number,
    search?: string
  ) => {
    const token = localStorage.getItem('authToken')
    const response = await api.get(`/users/${userId}/userFinishedGames`, {
      params: {
        pageIndex: page - 1,
        query: search || undefined
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },
  getUserPlayingGames: async (userId: string, page: number, search: string) => {
    const token = localStorage.getItem('authToken')
    const response = await api.get(`/users/${userId}/userPlayingGames`, {
      params: {
        pageIndex: page - 1,
        query: search || undefined
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },
  getUserPausedGames: async (userId: string, page: number, search: string) => {
    const token = localStorage.getItem('authToken')
    const response = await api.get(`/users/${userId}/userPausedGames`, {
      params: {
        pageIndex: page - 1,
        query: search || undefined
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },
  updateUser: async (
    userId: string | null,
    userName?: string,
    profilePicture?: string,
    userBanner?: string
  ) => {
    const token = localStorage.getItem('authToken')
    const response = await api.put(
      `/users/${userId}`,
      {
        userName,
        profilePicture,
        userBanner
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  }
})
