import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import type { GameCardData } from '../../types/games'
import { GameCard } from '../gamesComponents/gameCard'
import { coverLink } from './styles'

interface CoverRowProps<T extends GameCardData> {
  games: T[]
  renderMeta?: (game: T) => ReactNode
  className?: string
  itemClassName?: string
}

export function CoverRow<T extends GameCardData>({
  games,
  renderMeta,
  className,
  itemClassName,
}: CoverRowProps<T>) {
  return (
    <ul
      className={twMerge(
        '-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      {games.map(game => (
        <li
          key={game.igdbId}
          className={twMerge(
            'w-28 flex-none snap-start sm:w-36',
            itemClassName
          )}
        >
          <Link
            to={`/games/${encodeURIComponent(game.igdbId)}`}
            className={coverLink}
          >
            <GameCard game={game} size="medium" interactive={false} />
            <p className="mt-2 line-clamp-2 text-sm leading-snug text-white">
              {game.name}
            </p>
            {renderMeta?.(game)}
          </Link>
        </li>
      ))}
    </ul>
  )
}
