import { Link } from 'react-router-dom'
import { GameCard } from './gamesComponents/gameCard'
import { releaseYear } from '../utils/releaseDate'
import type { GameBase } from '../types/games'

const titleLink =
  'line-clamp-2 break-words rounded-sm text-sm font-medium leading-tight text-white transition-colors hover:text-primary-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light'

export function SearchResultCard({ game }: { game: GameBase }) {
  return (
    <li className="flex min-w-0 flex-col gap-1.5">
      <GameCard game={game} size="medium" enableModal />
      <Link to={`/games/${encodeURIComponent(game.igdbId)}`} className={titleLink}>
        {game.name}
      </Link>
      {game.releaseDate && (
        <p className="text-xs text-gray-400">{releaseYear(game.releaseDate)}</p>
      )}
    </li>
  )
}
