import { Link } from 'react-router-dom'
import { focusRing } from '../styles/focus'
import type { GameBase } from '../types/games'
import { releaseYear } from '../utils/releaseDate'
import { GameCard } from './gamesComponents/gameCard'

const titleLink = `line-clamp-2 break-words rounded-sm text-sm font-medium leading-tight text-white transition-colors hover:text-primary-link ${focusRing}`

export function SearchResultCard({ game }: { game: GameBase }) {
  return (
    <li className="flex min-w-0 flex-col gap-1.5">
      <GameCard game={game} size="medium" enableModal />
      <Link
        to={`/games/${encodeURIComponent(game.igdbId)}`}
        className={titleLink}
      >
        {game.name}
      </Link>
      {game.releaseDate && (
        <p className="text-xs text-gray-400">{releaseYear(game.releaseDate)}</p>
      )}
    </li>
  )
}
