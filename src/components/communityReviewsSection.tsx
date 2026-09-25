import { Link } from 'react-router-dom'
import { useCommunityReviews } from '../hooks/useCommunityReviews'
import { CommunityReviewCard } from './communityReviewCard'
import { SectionHeading } from './sectionHeading'

const PREVIEW_LIMIT = 3

export function CommunityReviewsSection({
  igdbId
}: {
  igdbId: string | undefined
}) {
  const { reviews, total, isLoading } = useCommunityReviews(
    igdbId,
    0,
    PREVIEW_LIMIT
  )

  if (isLoading) {
    return (
      <div className="h-40 rounded-lg border border-dark-border bg-dark-bg-light animate-pulse" />
    )
  }

  if (total === 0) return null

  return (
    <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <SectionHeading className="mb-0">Resenhas da comunidade</SectionHeading>
        <Link
          to={`/games/${igdbId}/reviews`}
          className="text-xs text-gray-400 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
        >
          Ver todas
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {reviews.map(review => (
          <CommunityReviewCard key={review.userId} review={review} clamp />
        ))}
      </div>
    </div>
  )
}
