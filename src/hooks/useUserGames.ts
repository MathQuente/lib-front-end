import { useMemo } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import { useAuth } from './useAuth'
import type {
  GameStatusEnum,
  GameToDisplayResponse,
  TotalPerStatus,
  UserGamesByStatus,
  UserGamesResponse
} from '../types/games'
import type { SortField, SortOrder } from '../interfaces/games'

const EMPTY_GROUPS: UserGamesByStatus = {
  PLAYED: [],
  PLAYING: [],
  PAUSED: [],
  BACKLOG: [],
  WISHLIST: []
}

export const useUserGames = (
  page?: number,
  search?: string | undefined,
  filter?: GameStatusEnum | undefined,
  sortOrder?: SortOrder,
  sortBy?: SortField
) => {
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

  const gamesByStatus = useMemo((): UserGamesByStatus => {
    if (!UserGamesResponse?.games) return EMPTY_GROUPS
    return UserGamesResponse.games
  }, [UserGamesResponse])

  const totalPerStatus = useMemo(
    (): TotalPerStatus[] => UserGamesResponse?.totalPerStatus ?? [],
    [UserGamesResponse]
  )

  return {
    UserGamesResponse,
    isLoadingUserGames,
    GamesToDisplay,
    isLoadingRecommendation,
    gamesByStatus,
    totalPerStatus
  }
}
