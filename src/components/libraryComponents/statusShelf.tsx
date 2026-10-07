import { Link } from 'react-router-dom'
import type { UserGameEntry } from '../../types/games'
import { GameCard, LIBRARY_STATUS_BADGES } from '../gamesComponents/gameCard'
import { sectionTitle } from '../homeComponents/styles'

const shelfLink =
  'whitespace-nowrap rounded-sm text-primary-light underline underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light'

const allLinkClass =
  'shrink-0 whitespace-nowrap rounded-sm text-sm text-primary-light transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light'

export interface ShelfLink {
  to: string
  label: string
}

interface StatusShelfProps {
  status: keyof typeof LIBRARY_STATUS_BADGES
  title: string
  games: UserGameEntry[]
  summary: string
  emptyText: string
  emptyLink?: ShelfLink
  allLink?: ShelfLink
  featured?: boolean
}

export function StatusShelf({
  status,
  title,
  games,
  summary,
  emptyText,
  emptyLink,
  allLink,
  featured = false,
}: StatusShelfProps) {
  const { icon: Icon, iconColor } = LIBRARY_STATUS_BADGES[status]
  const isEmpty = games.length === 0

  return (
    <section
      className={`min-w-0 border-t border-dark-border first:border-t-0 ${isEmpty ? 'py-5' : 'pb-8 pt-6'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className={`flex items-center gap-2 ${sectionTitle}`}>
            <Icon
              className={`size-5 shrink-0 ${iconColor} ${isEmpty ? 'opacity-60' : ''}`}
              aria-hidden="true"
            />
            {title}
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            {isEmpty ? emptyText : summary}
            {isEmpty && emptyLink && (
              <>
                {' '}
                <Link to={emptyLink.to} className={shelfLink}>
                  {emptyLink.label}
                </Link>
              </>
            )}
          </p>
        </div>
        {!isEmpty && allLink && (
          <Link to={allLink.to} className={allLinkClass}>
            {allLink.label}
          </Link>
        )}
      </div>

      {!isEmpty && (
        <ul
          className={
            featured
              ? 'mt-5 flex gap-3 lg:gap-6'
              : '-mx-4 mt-5 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-[repeat(6,minmax(0,12.5rem))] lg:gap-5 lg:max-2xl:[&>li:nth-child(n+7)]:hidden 2xl:grid-cols-[repeat(8,minmax(0,12.5rem))] lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden'
          }
        >
          {games.map(game => (
            <li
              key={game.igdbId}
              className={
                featured
                  ? 'w-32 min-w-0 sm:w-44 lg:w-56'
                  : 'w-32 min-w-0 flex-none snap-start sm:w-40 lg:w-auto'
              }
            >
              <GameCard game={game} size="medium" enableModal />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
