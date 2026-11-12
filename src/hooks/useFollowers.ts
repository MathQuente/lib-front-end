import { useQuery } from '@tanstack/react-query'
import type { GetFollowersResponse } from '../types/follow'
import { api } from './useApi'

export const useFollowers = (userId: string | undefined) => {
  const { data, isLoading } = useQuery<GetFollowersResponse>({
    queryKey: ['followers', userId],
    queryFn: () => api.getUserFollowers(userId ?? null),
    enabled: Boolean(userId),
  })

  return {
    followers: data?.followers ?? [],
    isLoading,
  }
}
