import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRating } from '../../hooks/useRating'
import type { SectionType } from '../../interfaces/games'
import type { GameBase } from '../../types/games'
import { shortPlatforms } from '../../utils/platformLabel'
import {
  daysUntilRelease,
  formatReleaseDate,
  formatReleaseDayMonth,
  releaseCountdown,
  releaseYear,
} from '../../utils/releaseDate'
import { GameCard } from '../gamesComponents/gameCard'
import { rowLink } from './styles'

const SCORE_FORMAT = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const SOON_DAYS = 7

type ScoreVariant = 'meta' | 'row' | 'feature'

export function RatedScore({
  igdbId,
  variant = 'meta',
}: {
  igdbId: number
  variant?: ScoreVariant
}) {
  const { average, isAverageLoading, isAverageError } = useRating(
    igdbId.toString()
  )

  const score =
    isAverageLoading || isAverageError || !average || average.average == null
      ? null
      : SCORE_FORMAT.format(average.average)

  if (score === null) {
    return (
      <p className="text-xs text-gray-400">
        {isAverageLoading ? '—' : 'Sem avaliações'}
      </p>
    )
  }

  if (variant === 'feature') {
    return (
      <p className="flex items-baseline gap-1 text-white">
        <Star
          className="size-5 self-center fill-current text-gray-300"
          aria-hidden="true"
        />
        <span className="font-display text-2xl font-extrabold tracking-tight tabular-nums">
          {score}
        </span>
        <span className="text-xs text-gray-400">/5</span>
      </p>
    )
  }

  return (
    <div
      className={`flex shrink-0 items-center gap-1 ${variant === 'meta' ? 'mt-0.5' : ''}`}
    >
      <Star
        className="size-3 fill-gray-300 text-gray-300"
        aria-hidden="true"
      />
      <span className="text-xs font-medium tabular-nums text-gray-300">
        {score}
      </span>
      <span className="text-xs text-gray-400">/5</span>
    </div>
  )
}

function CountdownChip({ releaseDate }: { releaseDate: number | null }) {
  const label = releaseDate ? releaseCountdown(releaseDate) : null
  if (!label) return null

  const soon = daysUntilRelease(releaseDate as number) <= SOON_DAYS
  return (
    <span
      className={`shrink-0 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${
        soon ? 'bg-primary/15 text-primary-link' : 'bg-white/5 text-gray-300'
      }`}
    >
      {label}
    </span>
  )
}

function platformsText(game: GameBase) {
  const { visible, hidden } = shortPlatforms(game.platforms)
  if (visible.length === 0) return ''
  return visible.join(' · ') + (hidden > 0 ? ` +${hidden}` : '')
}

function supportText(game: GameBase, type: SectionType) {
  const parts: Array<string | undefined> = []

  if (type === 'coming') {
    parts.push(
      game.releaseDate ? formatReleaseDate(game.releaseDate) : undefined
    )
  } else {
    if (type === 'trending' && game.releaseDate) {
      parts.push(String(releaseYear(game.releaseDate)))
    }
    parts.push(game.genres?.[0])
  }

  parts.push(platformsText(game))
  return parts.filter(Boolean).join(' · ')
}

function featureLines(game: GameBase, type: SectionType) {
  const year =
    game.releaseDate && type !== 'rateds'
      ? String(releaseYear(game.releaseDate))
      : ''
  const genres =
    type === 'coming' ? '' : (game.genres ?? []).slice(0, 2).join(', ')
  return {
    lineA: [year, genres].filter(Boolean).join(' · '),
    lineB: platformsText(game),
  }
}

const gamePath = (game: GameBase) =>
  `/games/${encodeURIComponent(game.igdbId)}`

export function GameRow({
  game,
  type,
  rank,
}: {
  game: GameBase
  type: SectionType
  rank?: number
}) {
  return (
    <Link to={gamePath(game)} className={rowLink}>
      {rank !== undefined && (
        <span
          className="w-5 shrink-0 text-right font-display text-lg font-extrabold tabular-nums text-gray-400"
          aria-hidden="true"
        >
          {rank}
        </span>
      )}
      <GameCard game={game} size="row" interactive={false} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-medium text-white">{game.name}</p>
        <p className="truncate text-xs text-gray-400">
          {supportText(game, type)}
        </p>
      </div>
      {type === 'coming' && <CountdownChip releaseDate={game.releaseDate} />}
      {type === 'rateds' && <RatedScore igdbId={game.igdbId} variant="row" />}
    </Link>
  )
}

export function FeaturedGameRow({
  game,
  type,
}: {
  game: GameBase
  type: SectionType
}) {
  const { lineA, lineB } = featureLines(game, type)

  return (
    <Link to={gamePath(game)} className={`${rowLink} items-start gap-4`}>
      <GameCard game={game} size="feature" interactive={false} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {type === 'coming' && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-display text-2xl font-extrabold tracking-tight tabular-nums text-white">
              {game.releaseDate ? formatReleaseDayMonth(game.releaseDate) : '—'}
            </p>
            <CountdownChip releaseDate={game.releaseDate} />
          </div>
        )}
        {type === 'trending' && (
          <p
            className="font-display text-2xl font-extrabold tracking-tight tabular-nums text-white"
            aria-hidden="true"
          >
            1
          </p>
        )}
        {type === 'rateds' && (
          <RatedScore igdbId={game.igdbId} variant="feature" />
        )}
        <p className="line-clamp-2 text-[17px] font-semibold leading-tight text-white">
          {game.name}
        </p>
        {lineA && <p className="text-xs text-gray-400">{lineA}</p>}
        {lineB && <p className="text-xs text-gray-400">{lineB}</p>}
      </div>
    </Link>
  )
}
