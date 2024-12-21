import axios from 'axios'
import { toast } from 'react-toastify'
import { tokenProvider } from './token'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

const tokenService = tokenProvider()

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      tokenService.removeTokens()
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)
export const useApi = () => ({
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
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
    const accessToken = tokenService.getAccessToken()
    try {
      await api.post(
        '/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
    } catch (error) {
      console.error('Logout failed:', error)
    }
  },
  refreshToken: async (refreshToken: string) => {
    try {
      const response = await api.post(
        '/auth/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        }
      )
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      return null
    }
  },
  getUserGames: async (
    userId: string | null,
    page?: number,
    search?: string,
    filter?: number
  ) => {
    const accessToken = tokenService.getAccessToken()
    const response = await api.get(`/users/${userId}/userGames`, {
      params: {
        filter: filter,
        pageIndex: page ? page - 1 : undefined,
        query: search || undefined
      },
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    return response.data
  },
  getUserProfile: async (userId: string | null) => {
    const accessToken = tokenService.getAccessToken()
    const response = await api.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
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
  getGame: async (gameId: string | undefined) => {
    const response = await api.get(`/games/${gameId}`)
    return response.data
  },
  getGameStatus: async (userId: string | null, itemId: string | undefined) => {
    const accessToken = tokenService.getAccessToken()
    const response = await api.get(`/users/${userId}/${itemId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data.UserGamesStatus
  },
  getSimilarGames: async (gameId: string | undefined) => {
    const response = await api.get(`/games/similarGames/${gameId}`)
    return response.data
  },
  addGame: async (
    userId: string | null,
    gameId: string | undefined,
    statusId: string | undefined
  ) => {
    const accessToken = tokenService.getAccessToken()
    const response = await api.post(
      `/users/${userId}/addGame/${gameId}/${statusId}`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    )
    return response
  },
  updateGameStatus: async (
    userId: string | null,
    gameId: string | undefined,
    statusId: string | null | undefined
  ) => {
    const accessToken = tokenService.getAccessToken()
    const response = await api.patch(
      `/users/userGamesStatus/${userId}/${gameId}/${statusId}`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    )
    return response
  },
  removeGame: async (userId: string | null, gameId: string | undefined) => {
    const accessToken = tokenService.getAccessToken()
    const response = await api.delete(`/users/${userId}/removeItem/${gameId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response
  },
  updateUser: async (
    userId: string | null,
    userName?: string,
    profilePicture?: string,
    userBanner?: string
  ) => {
    const accessToken = tokenService.getAccessToken()
    const response = await api.patch(
      `/users/${userId}`,
      {
        userName,
        profilePicture,
        userBanner
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    return response.data
  }
})
