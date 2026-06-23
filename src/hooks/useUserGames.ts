import { useMemo } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import { useAuth } from './useAuth'
import type {
  GameBase,
  GameStatusEnum,
  GameToDisplayResponse,
  UserGamesResponse
} from '../types/games'
import type { TotalPerStatus } from '../types/user'

type GamesByStatus = Record<string, GameBase[]>

const EMPTY_GROUPS: GamesByStatus = {
  PLAYED: [],
  PLAYING: [],
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
    if (!UserGamesResponse?.userGames.length) return EMPTY_GROUPS
    const groups: GamesByStatus = {
      PLAYED: [],
      PLAYING: [],
      BACKLOG: [],
      WISHLIST: []
    }
    for (const entry of UserGamesResponse.userGames) {
      const key = entry.status.name.toUpperCase()
      if (key in groups) groups[key].push(entry)
    }
    return groups
  }, [UserGamesResponse])

  const totalPerStatus = useMemo(
    (): TotalPerStatus[] =>
      Object.entries(gamesByStatus).map(([status, games]) => ({
        status,
        totalGames: games.length
      })),
    [gamesByStatus]
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
