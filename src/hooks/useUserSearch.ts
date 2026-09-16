import { useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import type { SearchUsersResponse } from '../types/follow'

export const useUserSearch = (query: string) => {
  const { data, isLoading } = useQuery<SearchUsersResponse>({
    queryKey: ['userSearch', query],
    queryFn: () => api.searchUsers(query),
    enabled: query.trim().length > 0
  })

  return {
    users: data?.users ?? [],
    isLoading
  }
}
