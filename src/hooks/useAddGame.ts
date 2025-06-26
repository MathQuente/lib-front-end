import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from './useApi'
import { toast } from 'react-toastify'
import type { Game } from '../types/games'
import { useAuth } from './useAuth'

export const useAddGame = (gameId?: string) => {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const addGame = useMutation({
    mutationFn: (data: { statusIds: number }) =>
      api.addGame(userId, gameId, data.statusIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gamesStatus', userId, gameId]
      })
      toast.success('Game added successfully 👌')
    },
    onError: error => {
      toast.error(
        `Add game error: ${
          error instanceof Error ? error.message : 'Unknown error'
        } 🤯`
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      queryClient.invalidateQueries({ queryKey: ['gamesStatus'] })
      queryClient.invalidateQueries({
        queryKey: ['rating', userId, gameId]
      })
    }
  })

  const removeGame = useMutation({
    mutationFn: () => api.removeGame(userId, gameId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['games'] })
      await queryClient.cancelQueries({
        queryKey: ['gamesStatus', userId, gameId]
      })

      const previousGames = queryClient.getQueryData(['games'])
      const previousGameStatus = queryClient.getQueryData([
        'gamesStatus',
        userId,
        gameId
      ])
      const previousRating = queryClient.getQueryData([
        'rating',
        userId,
        gameId
      ])

      queryClient.setQueryData(['games'], (old: Game[] | undefined) =>
        old ? old.filter(g => g.id !== gameId) : []
      )
      queryClient.setQueryData(['gamesStatus', userId, gameId], null)
      queryClient.setQueryData(['rating', userId, gameId], null)

      return { previousGames, previousGameStatus, previousRating }
    },
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ['gamesStatus', userId, gameId]
      })

      toast.success('Game removed successfully 👌')
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(['games'], context?.previousGames)
      queryClient.setQueryData(
        ['gamesStatus', userId, gameId],
        context?.previousGameStatus
      )
      queryClient.setQueryData(
        ['rating', userId, gameId],
        context?.previousRating
      )

      toast.error(
        `Remove game error: ${
          err instanceof Error ? err.message : 'Unknown error'
        } 🤯`
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['gamesStatus'] })
      queryClient.invalidateQueries({
        queryKey: ['rating', userId, gameId]
      })
    }
  })

  const removeUserGame = useMutation({
    mutationFn: () => api.removeGame(userId, gameId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['userGames', userId] })
      await queryClient.cancelQueries({
        queryKey: ['gamesStatus', userId, gameId]
      })

      const previousGames = queryClient.getQueryData(['userGames', userId])
      const previousGameStatus = queryClient.getQueryData([
        'gamesStatus',
        userId,
        gameId
      ])

      return { previousGames, previousGameStatus }
    },
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ['gamesStatus', userId, gameId]
      })

      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      queryClient.invalidateQueries({ queryKey: ['gamesStatus'] })

      toast.success('Game removed successfully 👌')
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(['userGames', userId], context?.previousGames)
      queryClient.setQueryData(
        ['gamesStatus', userId, gameId],
        context?.previousGameStatus
      )
      toast.error(
        `Remove game error: ${
          err instanceof Error ? err.message : 'Unknown error'
        } 🤯`
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      queryClient.invalidateQueries({ queryKey: ['gamesStatus'] })
      queryClient.invalidateQueries({
        queryKey: ['rating', userId, gameId]
      })
    }
  })

  return {
    addGame: addGame.mutateAsync,
    removeGame: removeGame.mutateAsync,
    removeUserGame: removeUserGame.mutateAsync
  }
}
