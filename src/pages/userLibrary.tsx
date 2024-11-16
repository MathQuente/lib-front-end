import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { PiGameControllerBold } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import SideBar from '../components/sideBar'

import { useApi } from '../hooks/useApi'

import type { UserGamesResponse } from '../types/user'

import { UserGameCard } from '../components/userGamesComponents/userGameCard'
import { UserProfileDisplay } from '../components/userGamesComponents/userProfileDisplay'

export function UserLibrary() {
  const api = useApi()
  const userId = api.getUserIdFromToken()

  const { data: UserGamesResponse } = useQuery<UserGamesResponse>({
    queryKey: ['userGames', userId],
    queryFn: async () => api.getUserGames(userId),
    placeholderData: keepPreviousData,
  })

  if (!UserGamesResponse) {
    return null
  }

  const userGamesFinished = UserGamesResponse.userGames
    .filter(userGame => userGame.UserGamesStatus.status === 'finished')
    .slice(0, 6)

  const totalGamesFinished = UserGamesResponse.totalPerStatus.find(
    total => total.statusId === 1
  )

  const userGamesPlaying = UserGamesResponse.userGames
    .filter(userGame => userGame.UserGamesStatus.status === 'playing')
    .slice(0, 6)

  const totalGamesPlaying = UserGamesResponse.totalPerStatus.find(
    total => total.statusId === 2
  )

  const userGamesPaused = UserGamesResponse.userGames
    .filter(userGame => userGame.UserGamesStatus.status === 'paused')
    .slice(0, 6)

  const totalGamesPaused = UserGamesResponse.totalPerStatus.find(
    total => total.statusId === 3
  )

  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg-[#1A1C26] ">
        <SideBar />

        <div className="flex flex-col items-center mt-4">
          <UserProfileDisplay />

          <div className="flex flex-col mt-8 bg-[#272932] w-[1500px] h-[410px] p-4">
            <div className="flex flex-row items-center justify-between mb-2 px-1">
              <div className="flex flex-row items-center gap-1">
                <h2 className="text-3xl font-bold text-white">Finished</h2>
                <PiGameControllerBold className="size-6 text-white" />
                <p className="text-base text-white font-bold">
                  {totalGamesFinished?.totalGames}
                </p>
              </div>

              {(totalGamesFinished?.totalGames || 0) > 0 && (
                <Link
                  to="/userLibrary/finishedGames"
                  className="text-[#7A38CA] font-bold"
                >
                  Show all
                </Link>
              )}
            </div>
            {(totalGamesFinished?.totalGames || 0) > 0 ? (
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-6 gap-4">
                  <UserGameCard userGamesAndDlcs={userGamesFinished} />
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-4 justify-center items-center h-full">
                <h2 className="text-black font-bold text-3xl">
                  Sem jogos adicionados. Procure jogos{' '}
                  <Link to="/games" className="text-red-500">
                    aqui.
                  </Link>
                </h2>
              </div>
            )}
          </div>

          <div className="flex flex-col mt-8 bg-[#272932] w-[1500px] h-[410px] p-4">
            <div className="flex flex-row items-center justify-between mb-2 px-1">
              <div className="flex flex-row items-center gap-1">
                <h2 className="text-3xl font-bold text-white">Playing</h2>
                <PiGameControllerBold className="size-6 text-white" />
                <p className="text-base text-white font-bold">
                  {totalGamesPlaying?.totalGames}
                </p>
              </div>

              {(totalGamesPlaying?.totalGames || 0) > 0 && (
                <Link
                  to="/userLibrary/playingGames"
                  className="text-[#7A38CA] font-bold"
                >
                  Show all
                </Link>
              )}
            </div>
            {(totalGamesPlaying?.totalGames || 0) > 0 ? (
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-6 gap-4">
                  <UserGameCard userGamesAndDlcs={userGamesPlaying} />
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-4 justify-center items-center h-full">
                <h2 className="text-black font-bold text-3xl">
                  Sem jogos adicionados. Procure jogos{' '}
                  <Link to="/games" className="text-red-500">
                    aqui.
                  </Link>
                </h2>
              </div>
            )}
          </div>

          <div className="flex flex-col mt-8 bg-[#272932] w-[1500px] h-[410px] p-4 mb-6">
            <div className="flex flex-row items-center justify-between mb-2 px-1">
              <div className="flex flex-row items-center gap-1">
                <h2 className="text-3xl font-bold text-white">Paused</h2>
                <PiGameControllerBold className="size-6 text-white" />
                <p className="text-base text-white font-bold">
                  {totalGamesPaused?.totalGames}
                </p>
              </div>

              {(totalGamesPaused?.totalGames || 0) > 0 && (
                <Link
                  to="/userLibrary/pausedGames"
                  className="text-[#7A38CA] font-bold"
                >
                  Show all
                </Link>
              )}
            </div>
            {(totalGamesPaused?.totalGames || 0) > 0 ? (
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-6 gap-4">
                  <UserGameCard userGamesAndDlcs={userGamesPaused} />
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-4 justify-center items-center h-full">
                <h2 className="text-black font-bold text-3xl">
                  Sem jogos adicionados. Procure jogos{' '}
                  <Link to="/games" className="text-red-500">
                    aqui.
                  </Link>
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
