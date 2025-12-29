// components/GamesGrid.tsx
import { CiSearch } from 'react-icons/ci'
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
  className = 'grid grid-cols-5 md:grid-cols-6 gap-2 md:gap-4'
}: GamesGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-16">
        <div className="text-center space-y-4">
          <CiSearch className="mx-auto size-16 text-[#8F8F8F]" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              {emptyStateTitle}
            </h3>
            <p className="text-[#8F8F8F] max-w-md">{emptyStateDescription}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {games.map(game => (
        <GameCard size="medium" key={game.id} game={game} enableModal />
      ))}
    </div>
  )
}
