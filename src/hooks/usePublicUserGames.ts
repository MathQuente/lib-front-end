import { useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import type { UserGamesResponse } from '../types/games'

const EMPTY_GROUPS: UserGamesResponse['games'] = {
  PLAYED: [],
  PLAYING: [],
  PAUSED: [],
  BACKLOG: [],
  WISHLIST: []
}

export const usePublicUserGames = (
  userId: string | undefined,
  enabled: boolean
) => {
  const { data, isLoading } = useQuery<UserGamesResponse>({
    queryKey: ['publicUserGames', userId],
    queryFn: () => api.getPublicUserGames(userId ?? null),
    enabled: Boolean(userId) && enabled
  })

  return {
    games: data?.games ?? EMPTY_GROUPS,
    totalPerStatus: data?.totalPerStatus ?? [],
    isLoading
  }
}
