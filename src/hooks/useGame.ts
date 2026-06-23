import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import type { GameResponse, SimilarGamesResponse } from '../types/games'

export const useGame = (igdbId: string | undefined) => {
  const { data: GameResponse } = useQuery<GameResponse>({
    queryKey: ['game', igdbId],
    queryFn: async () => api.getGame(igdbId)
  })

  const { data: SimilarGames } = useQuery<SimilarGamesResponse>({
    queryKey: ['similarGames', igdbId],
    queryFn: async () => api.getSimilarGames(igdbId),
    placeholderData: keepPreviousData
  })

  return {
    GameResponse,
    SimilarGames
  }
}
