import { useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import { useAuth } from './useAuth'
import type { UseGamesProps } from '../types/games'

export const SEARCH_PAGE_SIZE = 48

const QUERY_KEY_TERM = 2

export const useGameSearch = (query: string | undefined, page: number) => {
  const { user, loading: isLoadingAuth } = useAuth()

  const { data, isLoading, isError, isPlaceholderData, refetch } =
    useQuery<UseGamesProps>({
      queryKey: ['gameSearch', user?.id ?? null, query, page, SEARCH_PAGE_SIZE],
      queryFn: () => api.searchGames(query ?? '', page, SEARCH_PAGE_SIZE),
      enabled: !!query && !isLoadingAuth,
      placeholderData: (previous, previousQuery) =>
        previousQuery?.queryKey[QUERY_KEY_TERM] === query ? previous : undefined
    })

  return {
    games: data?.games ?? [],
    total: data?.total ?? 0,
    isLoading: isLoading || isLoadingAuth,
    isError,
    isPlaceholderData,
    refetch
  }
}
