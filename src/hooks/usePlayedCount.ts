import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { api } from './useApi'
import type { GameStatsResponse } from '../types/user'
import { toast } from 'react-toastify'
import { useGameStatus } from './useGameStatus'

export const getGameStatsQueryKey = (userId: string, gameId: string) => [
  'gameStats',
  userId,
  gameId
]

export const usePlayedCount = (gameId: string) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()
  
    const { gameStatus } = useGameStatus(gameId)
    const isPlayed = gameStatus?.userGameStatus?.id === 1

  const queryKey = getGameStatsQueryKey(userId, gameId)

  const { data: completionsData } = useQuery<GameStatsResponse>({
    queryKey: queryKey,
    queryFn: () => api.getGameStats(gameId),
    enabled: Boolean(gameId && userId && isPlayed),
    staleTime: 1000 * 60 * 5
  })

  const updatePlayedCount = useMutation({
    mutationFn: (incrementValue: number) => {
      return api.updateCompletionCount(gameId, incrementValue)
    },
    onMutate: async incrementValue => {
      await queryClient.cancelQueries({ queryKey: queryKey })

      const previousData = queryClient.getQueryData<GameStatsResponse>(queryKey)

      if (previousData) {
        const newCompletions = Math.max(
          (previousData.playedCount || 0) + incrementValue,
          1
        )
        queryClient.setQueryData<GameStatsResponse>(queryKey, {
          ...previousData,
          playedCount: newCompletions
        })
      }

      return { previousData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey
      })
      queryClient.invalidateQueries({
        queryKey: ['gamesStatus', userId, gameId]
      })
      toast.success('Contagem de finalizações atualizada com sucesso 👌')
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }

      toast.error(
        `Erro ao atualizar contagem: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        } 🤯`
      )
    }
  })

  return {
    completions: completionsData?.playedCount ?? 0,
    updatePlayedCount: (incrementValue: number) =>
      updatePlayedCount.mutateAsync(incrementValue),
    isLoading: updatePlayedCount.isPending
  }
}
