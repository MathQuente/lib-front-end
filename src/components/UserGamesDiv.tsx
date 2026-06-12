import { Link } from 'react-router-dom'
import { GameCard } from './gamesComponents/gameCard'
import type { UserGameDivProps, UserStatus } from '../interfaces/user'

const statusLabels: Record<UserStatus, string> = {
  PLAYED: 'Jogado',
  PLAYING: 'Jogando',
  BACKLOG: 'Backlog',
  WISHLIST: 'Lista de Desejos'
}

const statusOrder: UserStatus[] = ['PLAYED', 'PLAYING', 'BACKLOG', 'WISHLIST']

export function UserGamesDiv({ Games, totalPerStatus }: UserGameDivProps) {
  return (
    <div className="w-full mt-6 flex flex-col gap-4">
      {statusOrder.map(statusKey => {
        const gamesForStatus = Games[statusKey] || []
        const total =
          totalPerStatus.find(t => t.status === statusKey)?.totalGames ?? 0

        return (
          <div
            key={statusKey}
            className="bg-dark-bg-light border border-dark-border rounded-lg px-6 py-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-primary pl-3 uppercase tracking-wide">
                  {statusLabels[statusKey]}
                </h2>
                <span className="text-xs text-gray-600">{total}</span>
              </div>

              {gamesForStatus.length > 0 && (
                <Link
                  to={`/userLibrary/${statusKey.toLowerCase()}Games`}
                  className="text-xs text-gray-600 hover:text-primary transition-colors"
                >
                  Ver todos
                </Link>
              )}
            </div>

            {gamesForStatus.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {gamesForStatus.slice(0, 6).map(game => (
                  <GameCard
                    game={game}
                    key={game.id}
                    size="medium"
                    enableModal
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm py-1">
                Nenhum jogo adicionado.{' '}
                <Link to="/games" className="text-primary hover:underline">
                  Explorar jogos
                </Link>
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
