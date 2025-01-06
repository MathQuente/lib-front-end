import { Navbar } from './components/navBar'
import { SideBar, SidebarItem } from './components/sideBar'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { GamesResponse } from './types/games'
import { useApi } from './hooks/useApi'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'

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

  const { data: GamesResponse } = useQuery<GamesResponse>({
    queryKey: ['games', page, search],
    queryFn: async () => api.getGames(page, search),
    placeholderData: keepPreviousData,
  })

  if (!GamesResponse) {
    return null
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-screen bg-[#1A1C26]">
        <Navbar />
        <SideBar />

        <div className="grid grid-cols-3 w-full px-4">
          <div className="flex flex-col items-start ml-44">
            <div className="flex flex-col items-center gap-2 bg-[#272932] p-4">
              <h2 className="text-white font-bold text-2xl">Last launchers</h2>
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
            <div className="flex flex-col items-center gap-2 bg-[#272932] p-4">
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

          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-2 bg-[#272932] p-4">
              <h2 className="text-white font-bold text-2xl">Last launchers</h2>
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
            <div className="flex flex-col items-center gap-2 bg-[#272932] p-4">
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
          <div className="flex flex-col items-end mr-4">
            <div className="flex flex-col items-center gap-2 bg-[#272932] p-4">
              <h2 className="text-white font-bold text-2xl">Trending</h2>
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
                  .slice(0, 6)}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 bg-[#272932] p-4">
              <h2 className="text-white font-bold text-2xl">Most beated</h2>
              <div className="grid grid-cols-3 gap-2">
                {GamesResponse.games
                  .map(item => (
                    <img
                      key={item.id}
                      src={item.banner}
                      className="w-32 h-40 rounded-lg"
                      alt=""
                    />
                  ))
                  .slice(6, 12)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
