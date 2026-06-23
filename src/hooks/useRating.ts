import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './useApi'
import { useAuth } from './useAuth'
import { toast } from 'react-toastify'
import type {
  RatingResponse,
  RatingsDistributionResponse
} from '../types/rating'

export const getRatingQueryKey = (
  userId: string,
  igdbId: string | undefined
) => ['rating', userId, igdbId]

export const useRating = (igdbId: string | undefined) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const queryKey = getRatingQueryKey(userId, igdbId)

  const {
    data: userRatingResponse,
    isLoading: ratingIsLoading,
    isError: ratingIsError
  } = useQuery<RatingResponse>({
    queryKey,
    queryFn: () => api.getUserGameRating(igdbId),
    enabled: Boolean(userId && igdbId),
    staleTime: 1000 * 60 * 5
  })

  const addRating = useMutation({
    mutationFn: (value: number | null) =>
      api.addRatingForUserGame(igdbId, value),
    onMutate: async newValue => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<RatingResponse>(queryKey)

      if (newValue !== previous?.rating) {
        queryClient.setQueryData<RatingResponse>(queryKey, { rating: newValue })
      }

      queryClient.cancelQueries({ queryKey: ['gamesStatus', userId, igdbId] })

      return { previous }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', igdbId] })
      queryClient.invalidateQueries({
        queryKey: [igdbId, userRatingResponse?.rating, 'averageRating']
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
        queryKey: ['gamesStatus', userId, igdbId]
      })
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
    }
  })

  const removeRating = useMutation({
    mutationFn: () => api.removeRating(igdbId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<RatingResponse>(queryKey)
      queryClient.setQueryData<RatingResponse>(queryKey, { rating: null })
      return { previous }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rating', userId, igdbId] })
      queryClient.invalidateQueries({ queryKey: ['ratings', igdbId] })
      queryClient.invalidateQueries({
        queryKey: [igdbId, userRatingResponse?.rating, 'averageRating']
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
        queryKey: ['gamesStatus', userId, igdbId]
      })
    }
  })

  const {
    data: average,
    isLoading: isAverageLoading,
    isError: isAverageError
  } = useQuery({
    queryFn: () => api.getAverageRating(igdbId),
    queryKey: [igdbId, userRatingResponse?.rating, 'averageRating'],
    enabled: Boolean(igdbId),
    staleTime: 1000 * 60 * 5
  })

  const {
    data: RatingDistrubution,
    isLoading: isLoadingRating,
    isError: isErrorRatings
  } = useQuery<RatingsDistributionResponse>({
    queryFn: () => api.getRatingDistribution(igdbId),
    queryKey: ['ratings', igdbId],
    enabled: Boolean(igdbId),
    staleTime: 1000 * 60 * 5
  })

  return {
    userRating: userRatingResponse?.rating ?? null,
    average,
    allRatingsResponse: RatingDistrubution?.ratings,
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
