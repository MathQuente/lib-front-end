import dayjs from 'dayjs'
import { GameCard } from './gamesComponents/gameCard'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { Star } from 'lucide-react'
import type { GameListSectionProps } from '../interfaces/games'

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
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-gray-500">{game.rating}</span>
                    <Star className="size-2.5 text-gray-500" />
                  </div>
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
