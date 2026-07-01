import dayjs from 'dayjs'
import { GameCard } from './gamesComponents/gameCard'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { Star } from 'lucide-react'
import { useRating } from '../hooks/useRating'
import type { GameListSectionProps } from '../interfaces/games'

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
    return <p className="text-xs text-gray-600 mt-0.5">Sem avaliações</p>
  }

  return (
    <div className="flex items-center gap-1 mt-0.5">
      <Star className="size-3 text-primary fill-primary" />
      <span className="text-xs text-gray-300 font-medium">{score}</span>
      <span className="text-xs text-gray-600">/5</span>
    </div>
  )
}

export function GameListSection({
  games,
  title,
  className,
  type
}: GameListSectionProps) {
  return (
    <div className={twMerge('flex flex-col w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-primary pl-3 uppercase tracking-wide">
          {title}
        </h2>
        {type === 'coming' && (
          <Link
            to="/games/comingSoon"
            className="text-xs text-gray-600 hover:text-primary transition-colors"
          >
            Ver mais
          </Link>
        )}
      </div>

      {games.length === 0 ? (
        <p className="text-gray-600 text-sm py-2">Nenhum jogo disponível.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {games.map(game => (
            <div key={game.igdbId} className="flex gap-3 items-center">
              <Link to={`/games/${game.igdbId}`} className="flex-shrink-0">
                <GameCard game={game} size="small" />
              </Link>
              <div className="min-w-0">
                <Link to={`/games/${game.igdbId}`}>
                  <p className="text-sm text-white hover:text-primary transition-colors truncate">
                    {game.name}
                  </p>
                </Link>
                {type === 'rateds' ? (
                  <RatedScore igdbId={game.igdbId} />
                ) : (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {game.releaseDate
                      ? dayjs.unix(game.releaseDate).format('DD MMM YYYY')
                      : '—'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
