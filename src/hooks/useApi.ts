import axios from 'axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import type { GameStatusEnum } from '../types/games'

type UpdateUserPayload = {
  userName?: string
  profilePicture?: string
  userBanner?: string | null
}

const http = axios.create({
  baseURL: '/api',
  withCredentials: true
})

http.interceptors.response.use(
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
      }

      return Promise.reject(error)
    }
  }
)

export const api = {
  login: async (email: string, password: string) => {
    try {
      const response = await http.post('/auth/login', { email, password })
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
    const response = await http.post('/auth/register', { email, password })
    return response.data
  },
  logout: async () => {
    try {
      await http.post('/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      window.location.reload()
    }
  },
  getUserGames: async (
    page?: number,
    search?: string | undefined,
    filter?: GameStatusEnum,
    sortBy?: 'gameName' | 'dateRelease',
    sortOrder?: 'asc' | 'desc'
  ) => {
    const response = await http.get('/users/userGames', {
      params: {
        pageIndex: page ? page - 1 : undefined,
        query: search || undefined,
        filter: filter,
        sortBy,
        sortOrder
      }
    })
    return response.data
  },
  getUserProfile: async (userId: string | null) => {
    const response = await http.get(`/users/${userId}`, {})
    return response.data
  },
  getGames: async (
    page: number,
    search: string | undefined,
    sortBy: 'gameName' | 'dateRelease',
    sortOrder: 'asc' | 'desc',
    limit?: number
  ) => {
    const response = await http.get('/games', {
      params: {
        pageIndex: page - 1,
        query: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
        limit: limit ? limit : null
      }
    })
    return response.data
  },
  getGame: async (gameId: string | undefined) => {
    const response = await http.get(`/games/${gameId}`)
    return response.data
  },
  getGameStatus: async (gameId: string | undefined) => {
    const response = await http.get(`/users/gameStatus/${gameId}`, {})
    return response.data
  },
  getSimilarGames: async (gameId: string | undefined) => {
    const response = await http.get(`/games/similarGames/${gameId}`)
    return response.data
  },
  addGame: async (gameId: string | undefined, statusId: number) => {
    const response = await http.post(
      `/users/games/${gameId}`,
      { statusId },
      {}
    )
    return response
  },
  updateGameStatus: async (gameId: string | undefined, statusId: number) => {
    const response = await http.patch(
      `/users/gameStatus/${gameId}`,
      { statusId },
      {}
    )
    return response
  },
  removeGame: async (gameId: string | undefined) => {
    const response = await http.delete(`/users/games/${gameId}`, {
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
  updateUser: async (payload: UpdateUserPayload) => {
    const body: Record<string, string | null> = {}
    if (payload.userName !== undefined) body.userName = payload.userName
    if (payload.profilePicture !== undefined)
      body.profilePicture = payload.profilePicture
    if (payload.userBanner !== undefined) body.userBanner = payload.userBanner
    const response = await http.patch('/users', body, {})
    return response.data
  },
  getGameStats: async (gameId: string | undefined) => {
    const response = await http.get(`/users/playedCount/${gameId}`, {})
    return response.data
  },
  updateCompletionCount: async (
    gameId: string | undefined,
    incrementValue: number
  ) => {
    const response = await http.patch(
      `/users/playedCount/${gameId}`,
      { incrementValue },
      {}
    )
    return response
  },
  addRatingForUserGame: async (
    gameId: string | undefined,
    value: number | null
  ) => {
    const response = await http.post(
      `/rating/${gameId}`,
      { value },
      {}
    )
    return response
  },
  getUserGameRating: async (gameId: string | undefined) => {
    const response = await http.get(`/rating/${gameId}`, {})
    return response.data
  },
  removeRating: async (gameId: string | undefined) => {
    const response = await http.delete(`/rating/${gameId}`, {})
    return response
  },
  me: async () => {
    const response = await http.get('/users/me', {})
    return response.data
  },
  getGamesFeatured: async () => {
    const response = await http.get('/games/featured', {})
    return response.data
  },
  getAverageRating: async (gameId: string | undefined) => {
    const response = await http.get(`/rating/${gameId}/average`, {})
    return response.data
  },
  getRatingDistribution: async (gameId: string | undefined) => {
    const response = await http.get(`/rating/ratingDistribution/${gameId}`, {})
    return response.data
  },
  getGamesToDisplay: async () => {
    const response = await http.get('/users/featuredGames')
    return response.data
  },
  getComingSoon: async (
    page: number,
    search: string | undefined,
    sortOrder: 'asc' | 'desc',
    sortBy: 'gameName' | 'dateRelease'
  ) => {
    const response = await http.get('/games/comingSoon', {
      params: {
        pageIndex: page - 1,
        query: search,
        sortBy: sortBy,
        sortOrder: sortOrder
      }
    })
    return response.data
  }
}
