import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { api } from './useApi'
import type { IsFollowingResponse } from '../types/follow'

export const useFollow = (userId: string | undefined) => {
  const queryClient = useQueryClient()
  const queryKey = ['followStatus', userId]

  const { data, isLoading } = useQuery<IsFollowingResponse>({
    queryKey,
    queryFn: () => api.getFollowStatus(userId as string),
    enabled: Boolean(userId)
  })

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey })
    queryClient.invalidateQueries({ queryKey: ['followers'] })
    queryClient.invalidateQueries({ queryKey: ['following'] })
    queryClient.invalidateQueries({ queryKey: ['publicUserProfile'] })
  }

  const onError = (err: unknown) => {
    toast.error(err instanceof Error ? err.message : 'Erro inesperado')
  }

  const follow = useMutation({
    mutationFn: () => api.followUser(userId as string),
    onSuccess: invalidateAll,
    onError
  })

  const unfollow = useMutation({
    mutationFn: () => api.unfollowUser(userId as string),
    onSuccess: invalidateAll,
    onError
  })

  return {
    isFollowing: data?.isFollowing ?? false,
    isLoading,
    follow: () => follow.mutateAsync(),
    unfollow: () => unfollow.mutateAsync(),
    isMutating: follow.isPending || unfollow.isPending
  }
}
