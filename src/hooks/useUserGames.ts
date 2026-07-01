import { useMemo } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import { useAuth } from './useAuth'
import type {
  GameStatusEnum,
  GameToDisplayResponse,
  UserGameEntry,
  UserGamesResponse
} from '../types/games'
import type { TotalPerStatus } from '../types/user'

type GamesByStatus = Record<string, UserGameEntry[]>

const EMPTY_GROUPS: GamesByStatus = {
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
  sortOrder?: 'asc' | 'desc',
  sortBy?: 'name' | 'releaseDate'
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

  const gamesByStatus = useMemo((): GamesByStatus => {
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
