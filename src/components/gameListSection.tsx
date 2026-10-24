import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { CalendarClock, Star, TrendingUp } from 'lucide-react'
import type { GameListSectionProps, SectionType } from '../interfaces/games'
import type { GameBase } from '../types/games'
import { formatReleaseDate } from '../utils/releaseDate'
import { CoverRow } from './homeComponents/coverRow'
import {
  FeaturedGameRow,
  GameRow,
  RatedScore,
} from './homeComponents/gameListRows'
import { sectionTitle, textLink } from './homeComponents/styles'

const EMPTY_STATE_ICON: Record<SectionType, typeof Star> = {
  coming: CalendarClock,
  trending: TrendingUp,
  rateds: Star,
}

function GameMeta({ game, type }: { game: GameBase; type: SectionType }) {
  if (type === 'rateds') return <RatedScore igdbId={game.igdbId} />

  return (
    <p className="text-xs text-gray-400 mt-0.5">
      {game.releaseDate ? formatReleaseDate(game.releaseDate) : '—'}
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
          <div className="hidden lg:flex flex-col">
            <FeaturedGameRow game={games[0]} type={type} />
            {games.length > 1 && (
              <div className="mt-3 flex flex-col gap-1 border-t border-dark-border pt-3">
                {games.slice(1).map((game, i) => (
                  <GameRow
                    key={game.igdbId}
                    game={game}
                    type={type}
                    rank={type === 'coming' ? undefined : i + 2}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
