import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useApi } from './useApi'
import { useAuth } from './useAuth'
import type { UserGamesResponse } from '../types/user'

export const useUserGames = () => {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''

  const queryKey = ['userGames', userId]

  const {
    data: UserGamesResponse,
    isLoading,
    isError
  } = useQuery<UserGamesResponse>({
    queryKey: queryKey,
    queryFn: async () => api.getUserGames(),
    placeholderData: keepPreviousData,
    staleTime: 0,
    enabled: Boolean(userId)
  })

  return {
    UserGamesResponse,
    isLoading,
    isError
  }
}
