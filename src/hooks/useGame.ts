import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { api } from './useApi'
import { isValidIgdbId } from '../utils/isValidIgdbId'
import type { GameResponse, SimilarGamesResponse } from '../types/games'

export const useGame = (igdbId: string | undefined) => {
  const isValidId = isValidIgdbId(igdbId)

  const {
    data: GameResponse,
    isError: isGameError,
    error,
    refetch
  } = useQuery<GameResponse>({
    queryKey: ['game', igdbId],
    queryFn: async () => api.getGame(igdbId),
    enabled: isValidId
  })

  const { data: SimilarGames } = useQuery<SimilarGamesResponse>({
    queryKey: ['similarGames', igdbId],
    queryFn: async () => api.getSimilarGames(igdbId),
    placeholderData: keepPreviousData,
    enabled: isValidId
  })

  const isNotFound = isAxiosError(error) && error.response?.status === 404

  return {
    GameResponse,
    SimilarGames,
    isValidId,
    isNotFound,
    isLoadFailed: isGameError && !isNotFound && !GameResponse,
    refetch
  }
}
