import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useApi } from './useApi'
import { useAuth } from './useAuth'
import type {
  GameStatusEnum,
  GameToDisplayResponse,
  UserGamesResponse
} from '../types/games'

export interface UseGamesProps {
  games: UserGamesResponse
}

export const useUserGames = (
  page?: number,
  search?: string | undefined,
  filter?: GameStatusEnum | undefined,
  sortOrder?: 'asc' | 'desc',
  sortBy?: 'gameName' | 'dateRelease'
) => {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''

  const { data: UserGamesResponse, isLoading: isLoadingUserGames } =
    useQuery<UserGamesResponse>({
      queryKey: ['userGames', userId, page, search, filter, sortBy, sortOrder],
      queryFn: async () =>
        api.getUserGames(page, search, filter, sortBy, sortOrder),
      placeholderData: keepPreviousData,
      enabled: Boolean(userId)
    })

  const { data: GamesToDisplay, isLoading: isLoadingRecommendation } =
    useQuery<GameToDisplayResponse>({
      queryKey: ['games', userId],
      queryFn: async () => api.getGamesToDisplay(),
      placeholderData: keepPreviousData,
      enabled: Boolean(userId)
    })

  return {
    UserGamesResponse,
    isLoadingUserGames,
    GamesToDisplay,
    isLoadingRecommendation
  }
}
