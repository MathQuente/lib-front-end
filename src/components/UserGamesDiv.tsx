import { Link } from 'react-router-dom'
import { PiGameControllerBold } from 'react-icons/pi'
import { UserGameCard } from './userGamesComponents/userGameCard'
import type { TotalPerStatus, UserGameDlcBase } from '../types/user'

// Interface correta do objeto de mapeamento
interface StatusMapType {
  finished: number
  playing: number
  paused: number
}

interface UserGameDivProps {
  userGames: UserGameDlcBase[]
  totalPerStatus: TotalPerStatus[]
  statusMap: StatusMapType
}

export function UserGamesDiv({
  userGames,
  totalPerStatus,
  statusMap,
}: UserGameDivProps) {
  const userGamesByStatus = userGames.reduce((userGamesByStatus, userGame) => {
    const gameStatus = userGame.UserGamesStatus.status
    if (!userGamesByStatus.has(gameStatus)) {
      userGamesByStatus.set(gameStatus, [])
    }
    userGamesByStatus.get(gameStatus)!.push(userGame)
    return userGamesByStatus
  }, new Map<string, UserGameDlcBase[]>())

  return (
    <div className="space-y-8 mb-4">
      {Array.from(userGamesByStatus.entries()).map(
        ([gameStatus, userGames]) => {
          const statusId = statusMap[gameStatus as keyof StatusMapType]
          const total =
            totalPerStatus.find(t => t.statusId === statusId)?.totalGames || 0

          return (
            <div
              key={gameStatus}
              className="mt-8 bg-[#272932] rounded ml-24 w-[370px] sm:w-[500px] sm:ml-24 md:min-w-[650px] lg:ml-32 
              lg:min-w-[850px] xl:ml-32 xl:mr-8 xl:min-w-[1070px] 2xl:ml-24 2xl:min-w-[1280px] p-2"
            >
              <div className="flex items-center justify-between px-4">
                <div className="flex flex-row items-center gap-2 pb-2">
                  <h2 className="text-2xl font-bold text-white capitalize">
                    {gameStatus}
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
                    Show all
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
                  <h2 className="text-black text-xl font-bold">
                    Sem jogos adicionados. Procure jogos{' '}
                    <Link to="/games" className="text-red-500">
                      aqui
                    </Link>
                    .
                  </h2>
                </div>
              )}
            </div>
          )
        }
      )}
    </div>
  )
}
