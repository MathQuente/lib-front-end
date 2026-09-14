import { useQuery } from '@tanstack/react-query'
import { api } from './useApi'
import type { GetCommunityReviewsResponse } from '../types/review'

export const useCommunityReviews = (
  igdbId: string | undefined,
  pageIndex: number,
  limit?: number
) => {
  const { data, isLoading, isError } = useQuery<GetCommunityReviewsResponse>({
    queryKey: ['communityReviews', igdbId, pageIndex, limit],
    queryFn: () => api.getCommunityReviews(igdbId, pageIndex, limit),
    enabled: Boolean(igdbId)
  })

  return {
    reviews: data?.reviews ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError
  }
}
