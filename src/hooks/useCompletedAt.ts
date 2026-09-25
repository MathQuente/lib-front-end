import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { api } from './useApi'
import type { GameCompletedAtResponse } from '../types/user'
import { toast } from 'react-toastify'
import { useGameStatus } from './useGameStatus'
import { getErrorMessage } from '../utils/getErrorMessage'
import { USER_GAME_STATUS_ID as STATUS } from '../constants/gameStatus'

const getCompletedAtQueryKey = (userId: string, igdbId: string) => [
  'gameCompletedAt',
  userId,
  igdbId
]

export const useCompletedAt = (igdbId: string) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const { gameStatus } = useGameStatus(igdbId)
  const isPlayed = gameStatus?.userGameStatus?.id === STATUS.PLAYED

  const queryKey = getCompletedAtQueryKey(userId, igdbId)

  const { data } = useQuery<GameCompletedAtResponse>({
    queryKey,
    queryFn: () => api.getGameCompletedAt(igdbId),
    enabled: Boolean(igdbId && userId && isPlayed),
    staleTime: 1000 * 60 * 5
  })

  const updateCompletedAt = useMutation({
    mutationFn: (completedAt: string) => api.updateCompletedAt(igdbId, completedAt),
    onMutate: async completedAt => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<GameCompletedAtResponse>(queryKey)
      queryClient.setQueryData<GameCompletedAtResponse>(queryKey, { completedAt })

      return { previousData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      toast.success('Data de finalização atualizada com sucesso 👌')
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
      toast.error(getErrorMessage(error, 'Erro ao atualizar a data de finalização.'))
    }
  })

  return {
    completedAt: data?.completedAt ?? null,
    updateCompletedAt: (completedAt: string) =>
      updateCompletedAt.mutateAsync(completedAt),
    isLoading: updateCompletedAt.isPending
  }
}
