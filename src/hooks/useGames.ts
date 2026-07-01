import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery
} from '@tanstack/react-query'
import { api } from './useApi'
import type { GameBase, GamesFromHomePageResponse } from '../types/games'

export interface UseGamesProps {
  games: GameBase[]
  total: number
}

export const useGames = (
  page: number,
  search: string | undefined,
  sortBy: 'name' | 'releaseDate' | 'rating',
  sortOrder: 'asc' | 'desc',
  limit?: number
) => {
  const queryKey = ['games', page, search, sortBy, sortOrder]

  const {
    data: GamesResponse,
    isLoading,
    isError
  } = useQuery<UseGamesProps>({
    queryKey: queryKey,
    queryFn: async () => api.getGames(page, search, sortBy, sortOrder, limit),
    placeholderData: keepPreviousData
  })

  const {
    data: GamesResponseInfinity,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isLoadingInfinite,
    isError: isErrorInfinite
  } = useInfiniteQuery<UseGamesProps>({
    queryKey: ['gamesInfinite', search, sortBy, sortOrder],
    queryFn: async ({ pageParam }) =>
      api.getGames(pageParam as number, search, sortBy, sortOrder, limit),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) {
        return undefined
      }

      const totalLoadedGames = allPages.reduce(
        (acc, page) => acc + (page.games.length || 0),
        0
      )

      if (totalLoadedGames < lastPage.total) {
        return allPages.length + 1
      }

      return undefined
    },
    initialPageParam: 1,
    enabled: !!limit
  })

  const { data: ComingSoon } = useQuery<UseGamesProps>({
    queryKey: ['comingSoon', page, search, sortBy, sortOrder, limit],
    queryFn: async () =>
      api.getComingSoon(page, search, sortOrder, sortBy, limit),
    placeholderData: keepPreviousData
  })

  const { data: gamesFeatured } = useQuery<GamesFromHomePageResponse>({
    queryKey: ['gamesFeatured'],
    queryFn: async () => api.getGamesFeatured(),
    placeholderData: keepPreviousData
  })

  return {
    GamesResponse,
    GamesResponseInfinity,
    ComingSoon,
    gamesFeatured,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingInfinite,
    isErrorInfinite,
    isLoading,
    isError
  }
}
