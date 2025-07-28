import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi } from './useApi'
import { useAuth } from './useAuth'
import { toast } from 'react-toastify'
import type { GameStatusResponse } from '../types/games'

export const getGameStatusQueryKey = (
  userId: string,
  gameId: string | undefined
) => ['gamesStatus', userId, gameId]

export const useGameStatus = (gameId: string | undefined) => {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const queryKey = getGameStatusQueryKey(userId, gameId)

  const { data: gameStatusResponse } = useQuery<GameStatusResponse>({
    queryKey,
    queryFn: () => api.getGameStatus(gameId),
    enabled: Boolean(userId && gameId),
    staleTime: 1000 * 60 * 5
  })

  const updateGameStatus = useMutation({
    mutationFn: (data: { statusIds: number }) =>
      api.updateGameStatus(gameId, data.statusIds),
    onMutate: async statusIds => {
      await queryClient.cancelQueries({ queryKey })

      return { statusIds }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({
        queryKey: ['gameStats', userId, gameId]
      })
      toast.success('Status do jogo atualizado com sucesso 👌')
    },
    onError: error => {
      toast.error(
        `Update game error: ${
          error instanceof Error ? error.message : 'Unknown error'
        } 🤯`
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['games']
      })
    }
  })

  const updateUserGameStatus = useMutation({
    mutationFn: async (data: { statusIds: number }) => {
      return api.updateGameStatus(gameId, data.statusIds)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey
      })

      // Invalidar a lista de jogos do usuário

      queryClient.invalidateQueries({
        queryKey: ['userGames', userId]
      })

      queryClient.invalidateQueries({
        queryKey: ['gameStats', userId, gameId]
      })

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
      // Invalidar outras queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['games']
      })
    }
  })

  return {
    gameStatus: gameStatusResponse,
    updateGameStatus: (data: { statusIds: number }) =>
      updateGameStatus.mutateAsync(data),
    updateUserGameStatus: (data: { statusIds: number }) =>
      updateUserGameStatus.mutateAsync(data)
  }
}
