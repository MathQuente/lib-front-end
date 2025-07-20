import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useApi } from './useApi'
import type { GameResponse, SimilarGamesResponse } from '../types/games'

export const useGame = (gameId: string | undefined) => {
  const api = useApi()

  const queryKey = ['game', gameId]

  const { data: GameResponse } = useQuery<GameResponse>({
    queryKey: queryKey,
    queryFn: async () => api.getGame(gameId)
  })

  const { data: SimilarGames } = useQuery<SimilarGamesResponse>({
    queryKey: ['similarGames'],
    queryFn: async () => api.getSimilarGames(gameId),
    placeholderData: keepPreviousData
  })

  return {
    GameResponse,
    SimilarGames
  }
}
