import { Search } from 'lucide-react'
import { GameCard } from '../gamesComponents/gameCard'
import type { GameBase } from '../../types/games'

interface GamesGridProps {
  games: GameBase[]
  emptyStateTitle?: string
  emptyStateDescription?: string
  className?: string
}

export function GamesGrid({
  games,
  emptyStateTitle = 'Nenhum jogo encontrado',
  emptyStateDescription = 'Você não adicionou nenhum jogo no momento.',
  className = 'grid grid-cols-5 md:grid-cols-6'
}: GamesGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-16 text-center">
        <Search className="size-12 text-gray-700 mb-4" />
        <h3 className="text-white font-medium mb-1">{emptyStateTitle}</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          {emptyStateDescription}
        </p>
      </div>
    )
  }

  return (
    <div className={`${className} p-2 gap-x-2 gap-y-4`}>
      {games.map(game => (
        <GameCard key={game.id} game={game} size="medium" enableModal />
      ))}
    </div>
  )
}
