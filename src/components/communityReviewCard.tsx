import { useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, RotateCcw, Clock, Infinity as InfinityIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { ReviewMarkdown } from './reviewMarkdown'
import { REVIEW_STATUS_LABEL } from '../constants/gameStatus'
import { useIsClamped } from '../hooks/useIsClamped'
import { focusRing } from '../styles/focus'
import userProfilePictureDefault from '../assets/Default_pfp.svg.png'
import type { CommunityReview } from '../types/review'
import { formatHours, formatHoursSpoken } from '../utils/hours'

function ExpandableText({ text }: { text: string }) {
  const bodyId = useId()
  const bodyRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const isClamped = useIsClamped(bodyRef, expanded, text)

  return (
    <div className="flex flex-col max-w-[72ch]">
      <div
        id={bodyId}
        ref={bodyRef}
        className={`text-[15px] text-gray-300 ${expanded ? '' : 'line-clamp-4 overflow-hidden'}`}
      >
        <ReviewMarkdown text={text} />
      </div>
      {isClamped && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => setExpanded(value => !value)}
          className={`self-start py-1.5 text-sm text-primary-link hover:text-white transition-colors rounded-sm ${focusRing}`}
        >
          {expanded ? 'Ler menos' : 'Ler mais'}
        </button>
      )}
    </div>
  )
}

export function CommunityReviewCard({
  review,
  clamp = false,
  expandable = false,
  plain = false
}: {
  review: CommunityReview
  clamp?: boolean
  expandable?: boolean
  plain?: boolean
}) {
  const authorName = review.userName ?? 'Usuário'
  const statusLabel = review.status ? REVIEW_STATUS_LABEL[review.status] : undefined

  return (
    <div
      className={`flex flex-col gap-3 ${plain ? '' : 'bg-dark-bg-light border border-dark-border rounded-lg p-4'}`}
    >
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
            <p className="text-sm text-white font-medium truncate hover:text-white transition-colors">
              {authorName}
            </p>
            <p className="text-xs text-gray-400">
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
              <Star className="size-3 fill-current text-primary-light" aria-hidden="true" />
              {review.rating}
            </span>
          )}
          {review.hoursPlayed > 0 && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-dark-bg border border-dark-border"
              title="Horas jogadas"
              aria-label={`${formatHoursSpoken(review.hoursPlayed)} jogadas`}
            >
              <Clock className="size-3 text-primary-link" aria-hidden="true" />
              {formatHours(review.hoursPlayed)}
            </span>
          )}
          {review.completions > 0 && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-dark-bg border border-dark-border"
              title="Vezes finalizado"
              aria-label={`Finalizado ${review.completions}x`}
            >
              <RotateCcw className="size-3 text-primary-link" aria-hidden="true" />
              {review.completions}x
            </span>
          )}
          {statusLabel && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-dark-bg border border-dark-border"
              title="Status do jogo na biblioteca"
            >
              {statusLabel}
            </span>
          )}
          {review.endless === true && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-dark-bg border border-dark-border"
              title="Jogo sem fim"
            >
              <InfinityIcon className="size-3 text-primary-link" aria-hidden="true" />
              Sem fim
            </span>
          )}
        </div>
      </div>

      {expandable ? (
        <ExpandableText text={review.text} />
      ) : (
        <div
          className={`text-sm text-gray-300 ${clamp ? 'line-clamp-4 overflow-hidden' : ''}`}
        >
          <ReviewMarkdown text={review.text} />
        </div>
      )}
    </div>
  )
}
