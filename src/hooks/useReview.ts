import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './useApi'
import { useAuth } from './useAuth'
import { toast } from 'react-toastify'
import type { GetReviewResponse } from '../types/review'

const getReviewQueryKey = (userId: string, igdbId: string | undefined) => [
  'review',
  userId,
  igdbId
]

export const useReview = (igdbId: string | undefined) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const queryKey = getReviewQueryKey(userId, igdbId)

  const {
    data: reviewResponse,
    isLoading,
    isError
  } = useQuery<GetReviewResponse>({
    queryKey,
    queryFn: () => api.getOwnReview(igdbId),
    enabled: Boolean(userId && igdbId),
    staleTime: 1000 * 60 * 5
  })

  const saveReview = useMutation({
    mutationFn: (text: string) => api.upsertReview(igdbId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['communityReviews', igdbId] })
      toast.success('Review salva com sucesso 👌')
    },
    onError: err => {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao salvar review'
      )
    }
  })

  const deleteReview = useMutation({
    mutationFn: () => api.deleteReview(igdbId),
    onSuccess: () => {
      queryClient.setQueryData<GetReviewResponse>(queryKey, { review: null })
      queryClient.invalidateQueries({ queryKey: ['communityReviews', igdbId] })
      toast.success('Review removida com sucesso 👌')
    },
    onError: err => {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao remover review'
      )
    }
  })

  return {
    review: reviewResponse?.review ?? null,
    isLoading,
    isError,
    saveReview: (text: string) => saveReview.mutateAsync(text),
    deleteReview: () => deleteReview.mutateAsync(),
    isSaving: saveReview.isPending,
    isDeleting: deleteReview.isPending
  }
}
