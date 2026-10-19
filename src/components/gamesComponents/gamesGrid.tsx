import { GameCard } from '../gamesComponents/gameCard'
import { StatusMessage } from '../statusMessage'
import type { GamesGridProps } from '../../interfaces/games'

export function GamesGrid({
  games,
  emptyState,
  className = 'grid grid-cols-4 sm:grid-cols-6 2xl:grid-cols-8'
}: GamesGridProps) {
  if (games.length === 0) {
    return (
      <>
        {emptyState ?? (
          <StatusMessage
            variant="empty"
            title="Nenhum jogo por aqui"
            description="Nenhum jogo disponível no momento."
          />
        )}
      </>
    )
  }

  return (
    <div className={`${className} p-2 gap-x-1 sm:gap-x-4 gap-y-4`}>
      {games.map(game => (
        <GameCard key={game.igdbId} game={game} size="medium" enableModal />
      ))}
    </div>
  )
}
