import { Link } from 'react-router-dom'
import { Star, RotateCcw, Clock } from 'lucide-react'
import dayjs from 'dayjs'
import { ReviewMarkdown } from './reviewMarkdown'
import userProfilePictureDefault from '../assets/Default_pfp.svg.png'
import type { CommunityReview } from '../types/review'

export function CommunityReviewCard({
  review,
  clamp = false
}: {
  review: CommunityReview
  clamp?: boolean
}) {
  const authorName = review.userName ?? 'Usuário'

  return (
    <div className="bg-dark-bg-light border border-dark-border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={`/users/${review.userId}`}
          className="flex items-center gap-2.5 min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
        >
          <img
            src={review.profilePicture || userProfilePictureDefault}
            alt=""
            className="size-8 rounded-full object-cover border border-dark-border shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm text-white font-medium truncate hover:text-primary transition-colors">
              {authorName}
            </p>
            <p className="text-xs text-gray-500">
              {dayjs(review.createdAt).format('DD/MM/YYYY')}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 shrink-0 text-xs text-gray-300">
          {review.rating != null && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-dark-bg border border-dark-border"
              title="Nota dada ao jogo"
              aria-label={`Nota: ${review.rating}`}
            >
              <Star className="size-3 fill-current text-primary" aria-hidden="true" />
              {review.rating}
            </span>
          )}
          {review.hoursPlayed > 0 && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-dark-bg border border-dark-border"
              title="Horas jogadas"
              aria-label={`${review.hoursPlayed} horas jogadas`}
            >
              <Clock className="size-3 text-primary" aria-hidden="true" />
              {Number(review.hoursPlayed.toFixed(1))}h
            </span>
          )}
          {review.completions > 0 && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-dark-bg border border-dark-border"
              title="Vezes finalizado"
              aria-label={`Finalizado ${review.completions}x`}
            >
              <RotateCcw className="size-3 text-primary" aria-hidden="true" />
              {review.completions}x
            </span>
          )}
        </div>
      </div>

      <div
        className={`text-sm text-gray-300 ${clamp ? 'line-clamp-4 overflow-hidden' : ''}`}
      >
        <ReviewMarkdown text={review.text} />
      </div>
    </div>
  )
}
