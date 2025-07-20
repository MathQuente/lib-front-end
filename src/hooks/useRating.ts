import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi } from './useApi'
import { useAuth } from './useAuth'
import { toast } from 'react-toastify'
import type { RatingResponse } from '../types/user'
import type { RatingsResponse } from '../types/games'

export const getRatingQueryKey = (
  userId: string,
  gameId: string | undefined
) => ['rating', userId, gameId]

export const useRating = (gameId: string | undefined) => {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const queryKey = getRatingQueryKey(userId, gameId)

  const {
    data: ratingResponse,
    isLoading: ratingIsLoading,
    isError: ratingIsError
  } = useQuery<RatingResponse>({
    queryKey,
    queryFn: () => api.getUserGameRating(gameId),
    enabled: Boolean(userId && gameId),
    staleTime: 1000 * 60 * 5
  })

  const addRating = useMutation({
    mutationFn: (value: number | null) =>
      api.addRatingForUserGame(gameId, value),
    onMutate: async newValue => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<RatingResponse>(queryKey)

      if (newValue !== previous?.rating) {
        queryClient.setQueryData<RatingResponse>(queryKey, { rating: newValue })
      }

      queryClient.cancelQueries({ queryKey: ['gamesStatus', userId, gameId] })

      return { previous }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ratings', gameId]
      })
      queryClient.invalidateQueries({
        queryKey: [gameId, ratingResponse?.rating, 'averageRating']
      })
      toast.success('Avaliação atualizada com sucesso 👌')
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
      toast.error(err instanceof Error ? err.message : 'Error ao atualizar')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({
        queryKey: ['gamesStatus', userId, gameId]
      })
      queryClient.invalidateQueries({
        queryKey: ['userGames', userId]
      })
    }
  })

  const removeRating = useMutation({
    mutationFn: () => api.removeRating(gameId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<RatingResponse>(queryKey)
      queryClient.setQueryData<RatingResponse>(queryKey, { rating: null })
      return { previous }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rating', userId, gameId]
      })
      queryClient.invalidateQueries({
        queryKey: ['ratings', gameId]
      })
      queryClient.invalidateQueries({
        queryKey: [gameId, ratingResponse?.rating, 'averageRating']
      })
      toast.success('Avaliação removida com sucesso 👌')
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
      toast.error(
        err instanceof Error ? err.message : 'Erro ao remover avaliação'
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({
        queryKey: ['gamesStatus', userId, gameId]
      })
    }
  })

  const {
    data: average,
    isLoading: isAverageLoading,
    isError: isAverageError
  } = useQuery({
    queryFn: () => api.getAverageRating(gameId),
    queryKey: [gameId, ratingResponse?.rating, 'averageRating'],
    enabled: Boolean(gameId),
    staleTime: 1000 * 60 * 5
  })

  const {
    data: allRatingsResponse,
    isLoading: isLoadingRating,
    isError: isErrorRatings
  } = useQuery<RatingsResponse>({
    queryFn: () => api.getRatingDistribution(gameId),
    queryKey: ['ratings', gameId],
    enabled: Boolean(gameId),
    staleTime: 1000 * 60 * 5
  })

  return {
    rating: ratingResponse?.rating ?? null,
    average,
    allRatingsResponse: allRatingsResponse?.ratings,
    isLoadingRating,
    isErrorRatings,
    isLoading: ratingIsLoading,
    isError: ratingIsError,
    isAverageError,
    isAverageLoading,
    addRating: (value: number | null) => addRating.mutateAsync(value),
    removeRating: () => removeRating.mutateAsync(),
    isMutating: addRating.isPending || removeRating.isPending
  }
}
