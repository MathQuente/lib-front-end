import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useApi } from './useApi'
import type { GamesResponse } from '../types/games'

export const useGames = (
  page: number,
  search: string,
  sortBy: 'gameName' | 'dateRelease',
  sortOrder: 'asc' | 'desc'
) => {
  const api = useApi()

  const queryKey = ['games', page, search, sortBy, sortOrder]

  const {
    data: GamesResponse,
    isLoading,
    isError
  } = useQuery<GamesResponse>({
    queryKey: queryKey,
    queryFn: async () => api.getGames(page, search, sortBy, sortOrder),
    placeholderData: keepPreviousData
  })

  return {
    GamesResponse,
    isLoading,
    isError
  }
}
