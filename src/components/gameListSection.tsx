import dayjs from 'dayjs'
import { GameCard } from './gamesComponents/gameCard'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { CalendarClock, Star, TrendingUp } from 'lucide-react'
import { useRating } from '../hooks/useRating'
import type { GameListSectionProps, SectionType } from '../interfaces/games'
import type { GameBase } from '../types/games'
import { CoverRow } from './homeComponents/coverRow'
import { sectionTitle, textLink } from './homeComponents/styles'

const EMPTY_STATE_ICON: Record<SectionType, typeof Star> = {
  coming: CalendarClock,
  trending: TrendingUp,
  rateds: Star,
}

function RatedScore({ igdbId }: { igdbId: number }) {
  const { average, isAverageLoading, isAverageError } = useRating(
    igdbId.toString()
  )

  const score = (() => {
    if (isAverageLoading) return null
    if (isAverageError || !average || average.average == null) return null
    return Math.round(average.average * 10) / 10
  })()

  if (score === null) {
    return <p className="text-xs text-gray-400 mt-0.5">Sem avaliações</p>
  }

  return (
    <div className="flex items-center gap-1 mt-0.5">
      <Star className="size-3 text-gray-300 fill-gray-300" />
      <span className="text-xs text-gray-300 font-medium">{score}</span>
      <span className="text-xs text-gray-400">/5</span>
    </div>
  )
}

function GameMeta({ game, type }: { game: GameBase; type: SectionType }) {
  if (type === 'rateds') return <RatedScore igdbId={game.igdbId} />

  return (
    <p className="text-xs text-gray-400 mt-0.5">
      {game.releaseDate
        ? dayjs.unix(game.releaseDate).format('DD MMM YYYY')
        : '—'}
    </p>
  )
}

export function GameListSection({
  games,
  title,
  className,
  type,
}: GameListSectionProps) {
  return (
    <div className={twMerge('flex flex-col w-full min-w-0', className)}>
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className={sectionTitle}>{title}</h2>
        {type === 'coming' && (
          <Link to="/games/comingSoon" className={`text-sm ${textLink}`}>
            Ver mais
          </Link>
        )}
      </div>

      {games.length === 0 ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
          {(() => {
            const EmptyIcon = EMPTY_STATE_ICON[type]
            return <EmptyIcon className="size-4 shrink-0" />
          })()}
          <span>Nenhum jogo disponível no momento.</span>
        </div>
      ) : (
        <>
          <CoverRow
            games={games}
            className="lg:hidden"
            renderMeta={game => <GameMeta game={game} type={type} />}
          />
          <div className="hidden lg:flex flex-col gap-3">
            {games.map(game => (
              <Link
                to={`/games/${encodeURIComponent(game.igdbId)}`}
                key={game.igdbId}
                className="flex gap-3 items-center group rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              >
                <div className="flex-shrink-0">
                  <GameCard game={game} size="small" interactive={false} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white group-hover:underline underline-offset-4 truncate">
                    {game.name}
                  </p>
                  <GameMeta game={game} type={type} />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
