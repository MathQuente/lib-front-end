import { Navbar } from './components/navBar'
import { SideBar } from './components/sideBar'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { GamesResponse } from './types/games'
import { useApi } from './hooks/useApi'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import dayjs from 'dayjs'

export function App() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })
  const api = useApi()

  const { data: GamesResponse } = useQuery({
    queryKey: ['games', page, search],
    queryFn: async () => api.test(),
    placeholderData: keepPreviousData,
  })

  if (!GamesResponse) {
    return null
  }

  console.log(GamesResponse)

  return (
    <>
      <div className="flex flex-col w-full min-h-screen bg-[#1A1C26]">
        {/* <Navbar /> */}
        <SideBar />

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-start">Recently trending</h1>

          <div className="flex flex-row gap-6">
            {GamesResponse.recentGames.map(game => (
              <div className="flex flex-row w-full " key={game.id}>
                {/* <Link key={game.id} to={`/games/${game.id}`}> */}
                <img
                  src={game.gameBanner}
                  className="w-40 h-52 rounded-lg"
                  alt=""
                />
                {/* </Link> */}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="w-full max-w-sm">
              <div className="flex flex-row justify-between w-full mb-4">
                <h1>Coming soon</h1>
                <h1 className="text-gray-600">See more</h1>
              </div>
              <div className="flex flex-col gap-4">
                {GamesResponse.futureGames.map(game => (
                  <div className="flex flex-row w-full gap-2" key={game.id}>
                    {/* <Link key={game.id} to={`/games/${game.id}`}> */}
                    <img
                      src={game.gameBanner}
                      className="w-12 h-16 rounded-lg"
                      alt=""
                    />
                    <div>
                      <p className="text-white font-sans text-lg font-medium">
                        {game.gameName}
                      </p>
                      <p className="text-gray-400">
                        {dayjs(game.gameLaunchers[0].dateRelease).format(
                          'MMM DD'
                        )}
                      </p>
                    </div>
                    {/* </Link> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1">
            <div className="w-full max-w-sm">
              <div className="flex flex-row justify-between w-full mb-4">
                <h1>Most beated</h1>
                <h1 className="text-gray-600">See more</h1>
              </div>
              <div className="flex flex-col gap-4">
                {GamesResponse.mostBeateds.map(game => (
                  <div className="flex flex-row w-full gap-2" key={game.id}>
                    {/* <Link key={game.id} to={`/games/${game.id}`}> */}
                    <img
                      src={game.gameBanner}
                      className="w-12 h-16 rounded-lg"
                      alt=""
                    />
                    <div>
                      <p className="text-white font-sans text-lg font-medium">
                        {game.gameName}
                      </p>
                      <p className="text-gray-400">
                        {dayjs(game.gameLaunchers[0].dateRelease).format(
                          'MMM DD'
                        )}
                      </p>
                    </div>
                    {/* </Link> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-start-2 flex flex-row items-end w-[800px] bg-[#272932] rounded-md px-8 py-6 gap-4">
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-white font-bold text-2xl">Recent releases</h2>
              <div className="grid grid-cols-3 gap-2">
                {GamesResponse.recentGames.map(game => (
                  <Link key={game.id} to={`/games/${game.id}`}>
                    <img
                      src={game.gameBanner}
                      className="w-32 h-40 rounded-lg"
                      alt=""
                    />
                  </Link>
                ))}
              </div>
              <h2 className="text-white font-bold text-2xl">Coming soon</h2>
              <div className="grid grid-cols-3 gap-2">
                {GamesResponse.futureGames.map(game => (
                  <Link key={game.id} to={`/games/${game.id}`}>
                    <img
                      src={game.gameBanner}
                      className="w-32 h-40 rounded-lg"
                      alt=""
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 bg-[#272932]">
              <h2 className="text-white font-bold text-2xl">Trending</h2>
              <div className="grid grid-cols-3 gap-2">
                {GamesResponse.gamesTrending.map(game => (
                  <Link key={game.id} to={`/games/${game.id}`}>
                    <img
                      src={game.gameBanner}
                      className="w-32 h-40 rounded-lg"
                      alt=""
                    />
                  </Link>
                ))}
              </div>
              <h2 className="text-white font-bold text-2xl">Most beated</h2>
              <div className="grid grid-cols-3 gap-2">
                {GamesResponse.mostBeateds.map(game => (
                  <img
                    key={game.id}
                    src={game.gameBanner}
                    className="w-32 h-40 rounded-lg"
                    alt=""
                  />
                ))}
              </div>
            </div>
          </div> */}

        {/* <div className="col-start-2 flex flex-col items-center w-full">
            <div className="flex flex-col items-center gap-2 bg-[#272932] px-10 py-4">
              <h2 className="text-white font-bold text-2xl">
                Most recent game releases
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {GamesResponse.games
                  .map(game => (
                    <Link key={game.id} to={`/games/${game.id}`}>
                      <img
                        src={game.gameBanner}
                        className="w-32 h-40 rounded-lg"
                        alt=""
                      />
                    </Link>
                  ))
                  .slice(12, 18)}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 bg-[#272932] px-10 py-4">
              <h2 className="text-white font-bold text-2xl">
                Future launchers
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {GamesResponse.games
                  .map(item => (
                    <Link key={item.id} to={`/games/${item.id}`}>
                      <img
                        src={item.banner}
                        className="w-32 h-40 rounded-lg"
                        alt=""
                      />
                    </Link>
                  ))
                  .slice(12, 18)}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex flex-col items-center gap-2 bg-[#272932] px-10 py-4">
              <h2 className="text-white font-bold text-2xl">Trending</h2>
              <div className="grid grid-cols-3 gap-2">
                {GamesResponse.games
                  .map(game => (
                    <Link key={game.id} to={`/games/${game.id}`}>
                      <img
                        src={game.gameBanner}
                        className="w-32 h-40 rounded-lg"
                        alt=""
                      />
                    </Link>
                  ))
                  .slice(0, 6)}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 bg-[#272932] px-10 py-4">
              <h2 className="text-white font-bold text-2xl">Most beated</h2>
              <div className="grid grid-cols-3 gap-2">
                {GamesResponse.games
                  .map(game => (
                    <img
                      key={game.id}
                      src={game.gameBanner}
                      className="w-32 h-40 rounded-lg"
                      alt=""
                    />
                  ))
                  .slice(6, 12)}
              </div>
            </div>
          </div> */}
      </div>
    </>
  )
}
