import axios from 'axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import type { GameStatusEnum, UserGamesResponse } from '../types/games'
import type { SortField, SortOrder } from '../interfaces/games'
import type {
  UpdateUserPayload,
  UserProfileResponse,
  PublicUserProfileResponse
} from '../types/user'
import type { CreateRatingResponse } from '../types/rating'
import type {
  GetReviewResponse,
  UpsertReviewResponse,
  GetCommunityReviewsResponse
} from '../types/review'
import type {
  ConnectSteamResponse,
  StartImportResponse,
  ImportStatusResponse
} from '../types/steam'

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
    }

    return Promise.reject(error)
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
    sortBy?: SortField,
    sortOrder?: SortOrder
  ) => {
    // O endpoint /users/userGames usa nomes diferentes do resto do app
    // (gameName/dateRelease em vez de name/releaseDate) — mapeado aqui pra
    // não vazar essa inconsistência pro resto do front.
    const USER_GAMES_SORT_BY_MAP = {
      name: 'gameName',
      releaseDate: 'dateRelease',
      rating: 'rating'
    } as const

    const response = await http.get('/users/userGames', {
      params: {
        pageIndex: page ? page - 1 : undefined,
        query: search || undefined,
        filter: filter,
        sortBy: sortBy ? USER_GAMES_SORT_BY_MAP[sortBy] : undefined,
        sortOrder
      }
    })
    return response.data
  },
  getUserProfile: async (userId: string | null) => {
    const response = await http.get<PublicUserProfileResponse>(
      `/users/${userId}`,
      {}
    )
    return response.data
  },
  getPublicUserGames: async (userId: string | null) => {
    const response = await http.get<UserGamesResponse>(
      `/users/${userId}/games`,
      {}
    )
    return response.data
  },
  getGames: async (
    page: number,
    search: string | undefined,
    sortBy: SortField,
    sortOrder: SortOrder,
    limit?: number
  ) => {
    const response = await http.get('/games', {
      params: {
        pageIndex: page - 1,
        query: search,
        sortBy,
        sortOrder,
        limit: limit ? limit : null
      }
    })
    return response.data
  },
  getGame: async (igdbId: string | undefined) => {
    const response = await http.get(`/games/${igdbId}`)
    return response.data
  },
  getGameStatus: async (igdbId: string | undefined) => {
    const response = await http.get(`/users/gameStatus/${igdbId}`, {})
    return response.data
  },
  getSimilarGames: async (igdbId: string | undefined) => {
    const response = await http.get(`/games/similarGames/${igdbId}`)
    return response.data
  },
  addGame: async (igdbId: string | undefined, statusId: number) => {
    const response = await http.post(`/users/games/${igdbId}`, { statusId }, {})
    return response
  },
  updateGameStatus: async (igdbId: string | undefined, statusId: number) => {
    const response = await http.patch(
      `/users/gameStatus/${igdbId}`,
      { statusId },
      {}
    )
    return response
  },
  removeGame: async (igdbId: string | undefined) => {
    const response = await http.delete(`/users/games/${igdbId}`, {})
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
    const body: Record<string, string | boolean | null> = {}
    if (payload.userName !== undefined) body.userName = payload.userName
    if (payload.profilePicture !== undefined)
      body.profilePicture = payload.profilePicture
    if (payload.userBanner !== undefined) body.userBanner = payload.userBanner
    if (payload.isPublic !== undefined) body.isPublic = payload.isPublic
    const response = await http.patch('/users', body, {})
    return response.data
  },
  getGameStats: async (igdbId: string | undefined) => {
    const response = await http.get(`/users/playedCount/${igdbId}`, {})
    return response.data
  },
  updateCompletionCount: async (
    igdbId: string | undefined,
    incrementValue: number
  ) => {
    const response = await http.patch(
      `/users/playedCount/${igdbId}`,
      { incrementValue },
      {}
    )
    return response
  },
  getGameHours: async (igdbId: string | undefined) => {
    const response = await http.get(`/users/hoursPlayed/${igdbId}`, {})
    return response.data
  },
  updateHoursPlayed: async (igdbId: string | undefined, hoursPlayed: number) => {
    const response = await http.patch(
      `/users/hoursPlayed/${igdbId}`,
      { hoursPlayed },
      {}
    )
    return response
  },
  addRatingForUserGame: async (
    igdbId: string | undefined,
    value: number | null
  ) => {
    const response = await http.post<CreateRatingResponse>(
      `/rating/${igdbId}`,
      { value },
      {}
    )
    return response
  },
  getUserGameRating: async (igdbId: string | undefined) => {
    const response = await http.get(`/rating/${igdbId}`, {})
    return response.data
  },
  removeRating: async (igdbId: string | undefined) => {
    const response = await http.delete(`/rating/${igdbId}`, {})
    return response
  },
  me: async () => {
    const response = await http.get<UserProfileResponse>('/users/me', {})
    return response.data
  },
  getGamesFeatured: async () => {
    const response = await http.get('/games/featured', {})
    return response.data
  },
  getAverageRating: async (igdbId: string | undefined) => {
    const response = await http.get(`/rating/${igdbId}/average`, {})
    return response.data
  },
  getRatingDistribution: async (igdbId: string | undefined) => {
    const response = await http.get(`/rating/ratingDistribution/${igdbId}`, {})
    return response.data
  },
  getGamesToDisplay: async () => {
    const response = await http.get('/users/featuredGames')
    return response.data
  },
  getOwnReview: async (igdbId: string | undefined) => {
    const response = await http.get<GetReviewResponse>(
      `/reviews/${igdbId}`,
      {}
    )
    return response.data
  },
  upsertReview: async (igdbId: string | undefined, text: string) => {
    const response = await http.post<UpsertReviewResponse>(
      `/reviews/${igdbId}`,
      { text },
      {}
    )
    return response.data
  },
  deleteReview: async (igdbId: string | undefined) => {
    const response = await http.delete(`/reviews/${igdbId}`, {})
    return response
  },
  getCommunityReviews: async (
    igdbId: string | undefined,
    pageIndex: number,
    limit?: number
  ) => {
    const response = await http.get<GetCommunityReviewsResponse>(
      `/reviews/${igdbId}/community`,
      { params: { pageIndex, limit } }
    )
    return response.data
  },
  connectSteam: async (profileInput: string) => {
    const response = await http.patch<ConnectSteamResponse>(
      '/users/steam',
      { profileInput },
      {}
    )
    return response.data
  },
  startSteamImport: async () => {
    const response = await http.post<StartImportResponse>(
      '/users/steam/import',
      {},
      {}
    )
    return response.data
  },
  getSteamImportStatus: async () => {
    const response = await http.get<ImportStatusResponse>(
      '/users/steam/import',
      {}
    )
    return response.data
  },
  getComingSoon: async (
    page: number,
    search: string | undefined,
    sortOrder: SortOrder,
    sortBy: SortField,
    limit?: number
  ) => {
    const response = await http.get('/games/comingSoon', {
      params: {
        pageIndex: page - 1,
        query: search,
        sortBy,
        sortOrder,
        limit: limit ? limit : null
      }
    })
    return response.data
  }
}
