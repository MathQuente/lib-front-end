import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { api } from './useApi'
import type { GameStatsResponse } from '../types/user'
import { toast } from 'react-toastify'
import { useGameStatus } from './useGameStatus'
import { getErrorMessage } from '../utils/getErrorMessage'

const getGameStatsQueryKey = (userId: string, igdbId: string) => [
  'gameStats',
  userId,
  igdbId
]

export const usePlayedCount = (igdbId: string) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const { gameStatus } = useGameStatus(igdbId)
  const statusId = gameStatus?.userGameStatus?.id
  const isPlayed = statusId === 1
  const tracksCompletions = statusId !== undefined && statusId !== 5

  const queryKey = getGameStatsQueryKey(userId, igdbId)

  const { data: completionsData } = useQuery<GameStatsResponse>({
    queryKey: queryKey,
    queryFn: () => api.getGameStats(igdbId),
    enabled: Boolean(igdbId && userId && tracksCompletions),
    staleTime: 1000 * 60 * 5
  })

  const updatePlayedCount = useMutation({
    mutationFn: (incrementValue: number) => {
      return api.updateCompletionCount(igdbId, incrementValue)
    },
    onMutate: async incrementValue => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<GameStatsResponse>(queryKey)

      if (previousData) {
        const newCompletions = Math.max(
          (previousData.playedCount || 0) + incrementValue,
          isPlayed ? 1 : 0
        )
        queryClient.setQueryData<GameStatsResponse>(queryKey, {
          ...previousData,
          playedCount: newCompletions
        })
      }

      return { previousData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({
        queryKey: ['gamesStatus', userId, igdbId]
      })
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['gamesInfinite'] })
      queryClient.invalidateQueries({ queryKey: ['comingSoon'] })
      queryClient.invalidateQueries({ queryKey: ['gamesFeatured'] })
      queryClient.invalidateQueries({ queryKey: ['similarGames'] })
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
      toast.error(getErrorMessage(error, 'Erro ao atualizar contagem.'))
    }
  })

  return {
    completions: completionsData?.playedCount ?? 0,
    updatePlayedCount: (incrementValue: number) =>
      updatePlayedCount.mutateAsync(incrementValue),
    isLoading: updatePlayedCount.isPending
  }
}
