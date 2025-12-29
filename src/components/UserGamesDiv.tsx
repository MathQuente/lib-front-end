import { Link } from 'react-router-dom'
import { PiGameControllerBold } from 'react-icons/pi'

import type { TotalPerStatus } from '../types/user'
import type { GameBase } from '../types/games'
import { GameCard } from './gamesComponents/gameCard'

type Status = 'BACKLOG' | 'PLAYED' | 'PLAYING' | 'WISHLIST'

interface UserGameDivProps {
  Games: Record<Status, GameBase[]>
  totalPerStatus: TotalPerStatus[]
}

export function UserGamesDiv({ Games, totalPerStatus }: UserGameDivProps) {
  const statusTranslations: Record<string, string> = {
    PLAYED: 'Played',
    PLAYING: 'Playing',
    BACKLOG: 'Backlog',
    WISHLIST: 'Wishlist'
  }

  const statusOrder: Status[] = ['PLAYED', 'PLAYING', 'BACKLOG', 'WISHLIST']

  return (
    <div className="lg:w-[60rem] xl:w-[68rem]">
      {statusOrder.map(statusKey => {
        const gamesForStatus = Games[statusKey] || []
        const total =
          totalPerStatus.find(t => t.status === statusKey)?.totalGames ?? 0
        const displayStatus = statusTranslations[statusKey]

        return (
          <div
            key={statusKey}
            className="mt-8 bg-[#272932] rounded px-6 py-4 w-full"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-row items-center gap-2 pb-2">
                <h2 className="text-2xl font-bold text-white capitalize">
                  {displayStatus}
                </h2>
                <div className="flex gap-1">
                  <PiGameControllerBold className="text-white size-6" />
                  <span className="text-white font-bold">{total}</span>
                </div>
              </div>

              {gamesForStatus.length > 0 && (
                <Link
                  to={`/userLibrary/${statusKey.toLowerCase()}Games`}
                  className="text-[#7A38CA] font-bold"
                >
                  See all
                </Link>
              )}
            </div>

            {gamesForStatus.length > 0 ? (
              <div className="flex">
                <div
                  className="grid grid-cols-3 gap-x-3 gap-y-1
                                sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6
                                md:gap-x-4 lg:gap-x-4 2xl:gap-x-4"
                >
                  {gamesForStatus.slice(0, 6).map(game => (
                    <GameCard
                      game={game}
                      key={game.id}
                      size="medium"
                      enableModal
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center p-4">
                <h2 className="text-xl font-bold text-gray-300">
                  No games added yet. Search for it{' '}
                  <Link to="/games" className="text-[#7A38CA]">
                    here
                  </Link>
                  .
                </h2>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
