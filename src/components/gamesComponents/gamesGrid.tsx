// components/GamesGrid.tsx
import { CiSearch } from 'react-icons/ci'
import { GameCard } from '../gamesComponents/gameCard'
import type { GameBase } from '../../types/games'

interface GamesGridProps {
  games: GameBase[]
  search?: string
  onClearSearch?: () => void
  emptyStateTitle?: string
  emptyStateDescription?: string
  className?: string
}

export function GamesGrid({
  games,
  search,
  onClearSearch,
  emptyStateTitle = 'Nenhum jogo encontrado',
  emptyStateDescription,
  className = 'grid grid-cols-3 gap-x-2 gap-y-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6 xl:gap-4 2xl:grid-cols-6 2xl:gap-4'
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
            {search ? (
              <p className="text-[#8F8F8F] max-w-md">
                {emptyStateDescription ||
                  'Não encontramos jogos que correspondam à sua busca por '}
                <span className="text-[#6930CD] font-medium">"{search}"</span>
                {!emptyStateDescription &&
                  '. Tente usar termos diferentes ou verifique a ortografia.'}
              </p>
            ) : (
              <p className="text-[#8F8F8F] max-w-md">
                {emptyStateDescription ||
                  'Não há jogos disponíveis no momento. Tente novamente mais tarde.'}
              </p>
            )}
          </div>
          {search && onClearSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="mt-4 px-6 py-2 bg-[#6930CD] text-white rounded-lg hover:bg-[#5a28a8] transition-colors duration-200"
            >
              Limpar pesquisa
            </button>
          )}
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
