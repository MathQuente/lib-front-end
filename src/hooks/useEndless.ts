import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { GameStatusResponse } from '../types/games'
import { getErrorMessage } from '../utils/getErrorMessage'
import { api } from './useApi'
import { useAuth } from './useAuth'
import { useGameStatus } from './useGameStatus'

export const useEndless = (igdbId: string | undefined) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()
  const { gameStatus } = useGameStatus(igdbId)

  const queryKey = ['gamesStatus', userId, igdbId]

  const updateEndless = useMutation({
    mutationFn: (endless: boolean) => api.setEndless(igdbId, endless),
    onMutate: async endless => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<GameStatusResponse>(queryKey)
      if (previous) {
        queryClient.setQueryData<GameStatusResponse>(queryKey, {
          ...previous,
          endless,
        })
      }
      return { previous }
    },
    onError: (error, _endless, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
      toast.error(getErrorMessage(error, 'Erro ao atualizar a marca Infinito.'))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
    },
  })

  return {
    endless: gameStatus?.endless ?? false,
    setEndless: (endless: boolean) => updateEndless.mutateAsync(endless),
    isLoading: updateEndless.isPending,
  }
}
