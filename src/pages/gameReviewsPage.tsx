import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCommunityReviews } from '../hooks/useCommunityReviews'
import { CommunityReviewCard } from '../components/communityReviewCard'
import { Pagination } from '../components/pagination'
import { BackButton } from '../components/backButton'
import { EmptyState } from '../components/emptyState'

const PAGE_SIZE = 10

export function GameReviewsPage() {
  const { igdbId } = useParams<{ igdbId: string }>()
  const [page, setPage] = useState(1)

  const { reviews, total, isLoading } = useCommunityReviews(
    igdbId,
    page - 1,
    PAGE_SIZE
  )

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1)

  return (
    <>
      <BackButton className="mt-4" />

      <div className="w-full mt-2">
        <h1 className="text-lg font-semibold text-white mb-4">
          Resenhas da comunidade
        </h1>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, i) => `sk${i}`).map(k => (
              <div
                key={k}
                className="h-32 rounded-lg border border-dark-border bg-dark-bg-light animate-pulse"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            title="Nenhuma resenha ainda"
            description="Ninguém escreveu uma resenha pública pra esse jogo."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map(review => (
              <CommunityReviewCard key={review.userId} review={review} />
            ))}
          </div>
        )}

        {total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={reviews.length}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  )
}
