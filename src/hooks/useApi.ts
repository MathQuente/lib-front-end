import axios from 'axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import type { GameStatusEnum } from '../types/games'

type UpdateUserPayload = {
  userName?: string
  profilePicture?: string
  userBanner?: string | null
}

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const errorData = error.response.data

      if (
        errorData.status === 'session_expired' ||
        errorData.status === 'unauthorized'
      ) {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        // window.location.href = '/'
      }

      return Promise.reject(error)
    }
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
    const response = await api.post('/auth/register', { email, password })
    return response.data
  },
  logout: async () => {
    try {
      await api.post('/auth/logout', {}, {})
    } catch (error) {
      console.error('Logout failed:', error)
    }
  },
  refreshToken: async () => {
    try {
      // Envia automaticamente os cookies (incluindo refreshToken)
      const response = await api.post('/auth/refresh', {})

      // O backend deve definir novos cookies na resposta
      return response.data
    } catch (error) {
      console.error('Error refreshing token:', error)
      return null
    }
  },
  getUserGames: async (
    userId: string | null,
    page?: number,
    search?: string,
    filter?: GameStatusEnum
  ) => {
    const response = await api.get(`/users/${userId}/userGames`, {
      params: {
        filter: filter,
        pageIndex: page ? page - 1 : undefined,
        query: search || undefined
      }
    })
    return response.data
  },
  getUserProfile: async (userId: string | null) => {
    const response = await api.get(`/users/${userId}`, {})
    return response.data
  },
  getGames: async (
    page: number,
    search: string | undefined,
    sortBy: 'gameName' | 'dateRelease',
    sortOrder: 'asc' | 'desc'
  ) => {
    const response = await api.get('/games', {
      params: {
        pageIndex: page - 1,
        query: search,
        sortBy: sortBy,
        sortOrder: sortOrder
      }
    })
    return response.data
  },
  getGame: async (gameId: string | undefined) => {
    const response = await api.get(`/games/${gameId}`)
    return response.data
  },
  getGameStatus: async (userId: string | null, gameId: string | undefined) => {
    const response = await api.get(`/users/${userId}/${gameId}`, {})
    return response.data
  },
  getSimilarGames: async (gameId: string | undefined) => {
    const response = await api.get(`/games/similarGames/${gameId}`)
    return response.data
  },
  addGame: async (
    userId: string | null,
    gameId: string | undefined,
    statusIds: number
  ) => {
    const response = await api.post(
      `/users/${userId}/games/${gameId}`,
      {
        statusIds
      },
      {}
    )
    return response
  },
  updateGameStatus: async (
    userId: string | null,
    gameId: string | undefined,
    statusIds: number
  ) => {
    const response = await api.patch(
      `/users/${userId}/gameStatus/${gameId}`,
      { statusIds },
      {}
    )
    return response
  },
  removeGame: async (userId: string | null, gameId: string | undefined) => {
    const response = await api.delete(`/users/${userId}/games/${gameId}`, {
      headers: {}
    })
    return response
  },
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'images_preset')

    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dtdkzusmw/image/upload',
      formData
    )
    return response.data.secure_url
  },
  updateUser: async (userId: string, payload: UpdateUserPayload) => {
    const body: Record<string, string | null> = {}
    if (payload.userName !== undefined) body.userName = payload.userName
    if (payload.profilePicture !== undefined)
      body.profilePicture = payload.profilePicture
    if (payload.userBanner !== undefined) body.userBanner = payload.userBanner
    const response = await api.patch(`/users/${userId}`, body, {})
    return response.data
  },
  getGameStats: async (gameId: string | undefined, userId: string | null) => {
    const response = await api.get(`/users/${userId}/gameInfo/${gameId}`, {})
    return response.data
  },
  updateCompletionCount: async (
    userId: string | null,
    gameId: string | undefined,
    incrementValue: number
  ) => {
    const response = await api.patch(
      `/users/${userId}/playedCount/${gameId}`,
      {
        incrementValue
      }, // corpo vazio, pois todos os parâmetros estão na URL
      {}
    )
    return response
  },
  addRatingForUserGame: async (
    gameId: string | undefined,
    value: number | null
  ) => {
    const response = await api.post(
      `/rating/${gameId}`,
      {
        value
      },
      {}
    )
    return response
  },
  getUserGameRating: async (gameId: string | undefined) => {
    const response = await api.get(`/rating/${gameId}`, {})
    return response.data
  },
  removeRating: async (gameId: string | undefined) => {
    const response = await api.delete(`/rating/${gameId}`, {})
    return response
  },
  me: async () => {
    const response = await api.get('/users/me', {})
    return response.data
  },
  test: async () => {
    const response = await api.get('/games/test', {})
    return response.data
  },
  getAverageRating: async (gameId: string | undefined) => {
    const response = await api.get(`/rating/${gameId}/average`, {})
    return response.data
  },
  getRatingDistribution: async (gameId: string | undefined) => {
    const response = await api.get(`/rating/ratingDistribution/${gameId}`, {})
    return response.data
  }
})
