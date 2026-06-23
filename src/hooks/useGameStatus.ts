import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './useApi'
import { useAuth } from './useAuth'
import { toast } from 'react-toastify'
import type { GameStatusResponse } from '../types/games'

export const getGameStatusQueryKey = (
  userId: string,
  igdbId: string | undefined
) => ['gamesStatus', userId, igdbId]

export const useGameStatus = (igdbId: string | undefined) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const queryKey = getGameStatusQueryKey(userId, igdbId)

  const { data: gameStatusResponse } = useQuery<GameStatusResponse>({
    queryKey,
    queryFn: () => api.getGameStatus(igdbId),
    enabled: Boolean(userId && igdbId),
    staleTime: 1000 * 60 * 5
  })

  const updateGameStatus = useMutation({
    mutationFn: (data: { statusIds: number }) =>
      api.updateGameStatus(igdbId, data.statusIds),
    onMutate: async statusIds => {
      await queryClient.cancelQueries({ queryKey })
      return { statusIds }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['gameStats', userId, igdbId] })
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      toast.success('Status do jogo atualizado com sucesso 👌')
    },
    onError: error => {
      toast.error(
        `Erro ao atualizar status: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        } 🤯`
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
    }
  })

  return {
    gameStatus: gameStatusResponse,
    updateGameStatus: (data: { statusIds: number }) =>
      updateGameStatus.mutateAsync(data)
  }
}
