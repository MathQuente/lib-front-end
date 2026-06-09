import dayjs from 'dayjs'
import type { Game } from '../types/games'
import { GameCard } from './gamesComponents/gameCard'
import { Link } from 'react-router-dom'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { FaStar } from 'react-icons/fa'

type SectionType = 'coming' | 'trending' | 'rateds'

interface GameListSectionProps extends ComponentProps<'div'> {
  games: Game[]
  title: string
  type: SectionType
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
        <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-[#7A38CA] pl-3 uppercase tracking-wide">
          {title}
        </h2>
        {type === 'coming' && (
          <Link
            to="/games/comingSoon"
            className="text-xs text-gray-600 hover:text-[#7A38CA] transition-colors"
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
            <div key={game.id} className="flex gap-3 items-center">
              <Link to={`/games/${game.id}`} className="flex-shrink-0">
                <GameCard game={game} size="small" />
              </Link>
              <div className="min-w-0">
                <Link to={`/games/${game.id}`}>
                  <p className="text-sm text-white hover:text-[#7A38CA] transition-colors truncate">
                    {game.gameName}
                  </p>
                </Link>
                {type === 'rateds' ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {game.ratingAvg}
                    </span>
                    <FaStar className="size-2.5 text-gray-500" />
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dayjs(game.gameLaunchers[0].dateRelease).format(
                      'DD MMM YYYY'
                    )}
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
