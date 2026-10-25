import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import type { GamesFromHomePageResponse, UseGamesProps } from '../types/games'
import type { SortField, SortOrder } from '../interfaces/games'

export const useGames = (
  page: number,
  search: string | undefined,
  sortBy: SortField,
  sortOrder: SortOrder,
  limit?: number
) => {
  const queryKey = ['games', page, search, sortBy, sortOrder, limit]

  const {
    data: GamesResponse,
    isLoading,
    isError,
  } = useQuery<UseGamesProps>({
    queryKey: queryKey,
    queryFn: async () => api.getGames(page, search, sortBy, sortOrder, limit),
    placeholderData: keepPreviousData,
  })

  const { data: ComingSoon } = useQuery<UseGamesProps>({
    queryKey: ['comingSoon', page, search, sortBy, sortOrder, limit],
    queryFn: async () =>
      api.getComingSoon(page, search, sortOrder, sortBy, limit),
    placeholderData: keepPreviousData,
  })

  const {
    data: gamesFeatured,
    isLoading: isLoadingFeatured,
    isError: isErrorFeatured,
  } = useQuery<GamesFromHomePageResponse>({
    queryKey: ['gamesFeatured'],
    queryFn: async () => api.getGamesFeatured(),
    placeholderData: keepPreviousData,
  })

  return {
    GamesResponse,
    ComingSoon,
    gamesFeatured,
    isLoadingFeatured,
    isErrorFeatured,
    isLoading,
    isError,
  }
}
