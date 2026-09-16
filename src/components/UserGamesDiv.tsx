import { Link } from 'react-router-dom'
import { Gamepad2, Play, PauseCircle, Library, Gift } from 'lucide-react'
import { GameCard } from './gamesComponents/gameCard'
import { GameStatusEnum } from '../types/games'
import type { UserGameDivProps } from '../interfaces/user'

const statusLabels: Record<GameStatusEnum, string> = {
  [GameStatusEnum.Played]: 'Jogado',
  [GameStatusEnum.Playing]: 'Jogando',
  [GameStatusEnum.Paused]: 'Pausado',
  [GameStatusEnum.Backlog]: 'Pendentes',
  [GameStatusEnum.Wishlist]: 'Lista de desejos'
}

const statusIcons: Record<GameStatusEnum, typeof Gamepad2> = {
  [GameStatusEnum.Played]: Gamepad2,
  [GameStatusEnum.Playing]: Play,
  [GameStatusEnum.Paused]: PauseCircle,
  [GameStatusEnum.Backlog]: Library,
  [GameStatusEnum.Wishlist]: Gift
}

const statusOrder: GameStatusEnum[] = [
  GameStatusEnum.Played,
  GameStatusEnum.Playing,
  GameStatusEnum.Backlog,
  GameStatusEnum.Wishlist
]

export function UserGamesDiv({
  Games,
  totalPerStatus,
  showAllLink = true
}: UserGameDivProps) {
  return (
    <div className="w-full mt-6 flex flex-col gap-4">
      {statusOrder.map(statusKey => {
        const gamesForStatus = Games[statusKey] || []
        const total =
          totalPerStatus.find(t => t.status === statusKey)?.totalGames ?? 0
        const StatusIcon = statusIcons[statusKey]

        return (
          <div
            key={statusKey}
            className="bg-dark-bg-light border border-dark-border rounded-lg px-6 py-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wide">
                  <span className="size-1.5 bg-primary" aria-hidden="true" />
                  {statusLabels[statusKey]}
                </h2>
                <span className="text-xs text-gray-400">{total}</span>
              </div>

              {showAllLink && gamesForStatus.length > 0 && (
                <Link
                  to={`/userLibrary/${statusKey.toLowerCase()}Games`}
                  className="text-xs text-gray-400 hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
                >
                  Ver todos
                </Link>
              )}
            </div>

            {gamesForStatus.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {gamesForStatus.slice(0, 6).map(game => (
                  <GameCard
                    game={game}
                    key={game.igdbId}
                    size="medium"
                    enableModal
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-1">
                <StatusIcon className="size-4 shrink-0" />
                <p>
                  Nenhum jogo adicionado.{' '}
                  <Link
                    to="/games"
                    className="text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
                  >
                    Explorar jogos
                  </Link>
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
