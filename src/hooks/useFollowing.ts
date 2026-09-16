import { useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import type { GetFollowingResponse } from '../types/follow'

export const useFollowing = (userId: string | undefined) => {
  const { data, isLoading } = useQuery<GetFollowingResponse>({
    queryKey: ['following', userId],
    queryFn: () => api.getUserFollowing(userId ?? null),
    enabled: Boolean(userId)
  })

  return {
    following: data?.following ?? [],
    isLoading
  }
}
