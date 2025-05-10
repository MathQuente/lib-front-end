import { Link } from 'react-router-dom'
import { PiGameControllerBold } from 'react-icons/pi'
import { UserGameCard } from './userGamesComponents/userGameCard'
import type { TotalPerStatus, UserGameDlcBase } from '../types/user'

interface UserGameDivProps {
  userGames: UserGameDlcBase[]
  totalPerStatus: TotalPerStatus[]
}

export function UserGamesDiv({ userGames, totalPerStatus }: UserGameDivProps) {
  const userGamesByStatus = userGames.reduce((map, ug) => {
    if (!ug.UserGamesStatus || ug.UserGamesStatus.length === 0) {
      const noStatusKey = 'NO_STATUS'
      if (!map.has(noStatusKey)) map.set(noStatusKey, [])
      map.get(noStatusKey)!.push(ug)
      return map
    }

    for (const statusObj of ug.UserGamesStatus) {
      const status = statusObj.status?.toUpperCase() ?? 'NO_STATUS'
      if (!map.has(status)) map.set(status, [])
      map.get(status)!.push(ug)
    }

    return map
  }, new Map<string, UserGameDlcBase[]>())

  const statusTranslations: Record<string, string> = {
    PLAYED: 'Played',
    REPLAYING: 'Replaying',
    PLAYING: 'Playing',
    BACKLOG: 'Backlog',
    WISHLIST: 'Wishlist',
  }

  const statusOrder: string[] = [
    'PLAYED',
    'PLAYING',
    'REPLAYING',
    'BACKLOG',
    'WISHLIST',
  ]

  // Preparar entradas de status ordenadas
  const statusEntries = Array.from(userGamesByStatus.entries()).sort((a, b) => {
    return statusOrder.indexOf(a[0]) - statusOrder.indexOf(b[0])
  })

  return (
    <div className="space-y-8 mb-4">
      {/* Primeiro exibimos as categorias onde o usuário tem jogos */}
      {statusEntries
        .filter(([games]) => games.length > 0)
        .map(([gameStatus, statusGames]) => {
          // Encontrar o total de jogos para este status
          const total =
            totalPerStatus.find(t => t.status === gameStatus)?.totalGames || 0
          // Usar a tradução ou o status original
          const displayStatus = statusTranslations[gameStatus] || gameStatus

          return renderStatusSection(
            gameStatus,
            statusGames,
            total,
            displayStatus
          )
        })}

      {/* Depois exibimos as categorias vazias */}
      {totalPerStatus
        .filter(
          status =>
            status.totalGames === 0 && !userGamesByStatus.has(status.status)
        )
        .map(status => {
          const displayStatus =
            statusTranslations[status.status] || status.status
          return renderStatusSection(status.status, [], 0, displayStatus)
        })}
    </div>
  )

  function renderStatusSection(
    gameStatus: string,
    userGames: UserGameDlcBase[],
    total: number,
    displayStatus: string
  ) {
    return (
      <div
        key={`games-${gameStatus}`}
        className="mt-8 bg-[#272932] rounded ml-24 w-[370px] sm:w-[500px] sm:ml-24 md:min-w-[650px] lg:ml-32 
        lg:min-w-[850px] xl:ml-32 xl:mr-8 xl:min-w-[1070px] 2xl:ml-24 2xl:min-w-[1280px] p-2"
      >
        <div className="flex items-center justify-between px-4">
          <div className="flex flex-row items-center gap-2 pb-2">
            <h2 className="text-2xl font-bold text-white capitalize">
              {displayStatus}
            </h2>
            <div className="flex gap-1">
              <PiGameControllerBold className="text-white size-6" />
              <span className="text-white font-bold">{total}</span>
            </div>
          </div>

          {userGames.length > 0 && (
            <Link
              to={`/userLibrary/${gameStatus}Games`}
              className="text-[#7A38CA] font-bold"
            >
              See all
            </Link>
          )}
        </div>

        {userGames.length > 0 ? (
          <div className="flex justify-center py-2 px-2">
            <div className="grid grid-cols-3 gap-x-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 md:gap-x-4 lg:gap-x-4 2xl:gap-x-6">
              <UserGameCard userGamesAndDlcs={userGames.slice(0, 6)} />
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
  }
}
