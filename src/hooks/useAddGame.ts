import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './useApi'
import { toast } from 'react-toastify'
import type { GameBase } from '../types/games'
import { useAuth } from './useAuth'

export const useAddGame = (igdbId?: string) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const addGame = useMutation({
    mutationFn: (data: { statusIds: number }) =>
      api.addGame(igdbId, data.statusIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gamesStatus', userId, igdbId]
      })
      toast.success('Jogo adicionado com sucesso 👌')
    },
    onError: error => {
      toast.error(
        `Erro ao adicionar jogo: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        } 🤯`
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      queryClient.invalidateQueries({
        queryKey: ['gamesStatus', userId, igdbId]
      })
      queryClient.invalidateQueries({ queryKey: ['rating', userId, igdbId] })
    }
  })

  const removeGame = useMutation({
    mutationFn: () => api.removeGame(igdbId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['games'] })
      await queryClient.cancelQueries({
        queryKey: ['gamesStatus', userId, igdbId]
      })

      const previousGames = queryClient.getQueryData(['games'])
      const previousGameStatus = queryClient.getQueryData([
        'gamesStatus',
        userId,
        igdbId
      ])
      const previousRating = queryClient.getQueryData([
        'rating',
        userId,
        igdbId
      ])

      queryClient.setQueryData(['games'], (old: GameBase[] | undefined) =>
        old ? old.filter(g => g.igdbId !== Number(igdbId)) : []
      )
      queryClient.setQueryData(['gamesStatus', userId, igdbId], null)
      queryClient.setQueryData(['rating', userId, igdbId], null)

      return { previousGames, previousGameStatus, previousRating }
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['gamesStatus', userId, igdbId] })
      queryClient.invalidateQueries({ queryKey: ['gameStats', userId, igdbId] })
      toast.success('Jogo removido com sucesso 👌')
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(['games'], context?.previousGames)
      queryClient.setQueryData(
        ['gamesStatus', userId, igdbId],
        context?.previousGameStatus
      )
      queryClient.setQueryData(
        ['rating', userId, igdbId],
        context?.previousRating
      )
      toast.error(
        `Erro ao remover jogo: ${
          err instanceof Error ? err.message : 'Erro desconhecido'
        } 🤯`
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['gamesStatus'] })
      queryClient.invalidateQueries({ queryKey: ['rating', userId, igdbId] })
    }
  })

  const removeUserGame = useMutation({
    mutationFn: () => api.removeGame(igdbId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['userGames', userId] })
      await queryClient.cancelQueries({
        queryKey: ['gamesStatus', userId, igdbId]
      })

      const previousGames = queryClient.getQueryData(['userGames', userId])
      const previousGameStatus = queryClient.getQueryData([
        'gamesStatus',
        userId,
        igdbId
      ])

      return { previousGames, previousGameStatus }
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['gamesStatus', userId, igdbId] })
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      queryClient.invalidateQueries({ queryKey: ['gamesStatus'] })
      toast.success('Jogo removido com sucesso 👌')
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(['userGames', userId], context?.previousGames)
      queryClient.setQueryData(
        ['gamesStatus', userId, igdbId],
        context?.previousGameStatus
      )
      toast.error(
        `Erro ao remover jogo: ${
          err instanceof Error ? err.message : 'Erro desconhecido'
        } 🤯`
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      queryClient.invalidateQueries({ queryKey: ['gamesStatus'] })
      queryClient.invalidateQueries({ queryKey: ['rating', userId, igdbId] })
    }
  })

  return {
    addGame: addGame.mutateAsync,
    removeGame: removeGame.mutateAsync,
    removeUserGame: removeUserGame.mutateAsync
  }
}
