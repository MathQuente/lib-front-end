import { useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import type { GetFollowersResponse } from '../types/follow'

export const useFollowers = (userId: string | undefined) => {
  const { data, isLoading } = useQuery<GetFollowersResponse>({
    queryKey: ['followers', userId],
    queryFn: () => api.getUserFollowers(userId ?? null),
    enabled: Boolean(userId)
  })

  return {
    followers: data?.followers ?? [],
    isLoading
  }
}
