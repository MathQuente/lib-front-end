import { GameCard } from '../gamesComponents/gameCard'
import { EmptyState } from '../emptyState'
import type { GamesGridProps } from '../../interfaces/games'

export function GamesGrid({
  games,
  emptyState,
  className = 'grid grid-cols-5 md:grid-cols-6'
}: GamesGridProps) {
  if (games.length === 0) {
    return (
      <>
        {emptyState ?? (
          <EmptyState description="Nenhum jogo disponível no momento." />
        )}
      </>
    )
  }

  return (
    <div className={`${className} p-2 gap-x-4 gap-y-4`}>
      {games.map(game => (
        <GameCard key={game.igdbId} game={game} size="medium" enableModal />
      ))}
    </div>
  )
}
