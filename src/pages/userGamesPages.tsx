import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import { SideBar } from '../components/sideBar'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import type { GameBase, UserGamesResponse } from '../types/games'
import { useAuth } from '../hooks/useAuth'
import { GameStatusEnum } from '../types/games'
import { useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { SearchInput } from '../components/searchInput'
import { GamesGrid } from '../components/gamesComponents/gamesGrid'
import { Pagination } from '../components/pagination'

type StatusKey =
  | 'playedGames'
  | 'playingGames'
  | 'backlogGames'
  | 'wishlistGames'

export function UserGamesPageByStatus() {
  const topRef = useRef<HTMLDivElement>(null)
  const { status } = useParams<{ status: StatusKey }>()

  const api = useApi()
  const { user } = useAuth()

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })

  const userId = user?.id ?? ''

  const statusMap: Record<string, GameStatusEnum> = {
    Played: GameStatusEnum.Played,
    playingGames: GameStatusEnum.Playing,
    backlogGames: GameStatusEnum.Backlog,
    wishlistGames: GameStatusEnum.Wishlist
  }

  const filter = statusMap[status ?? 'playedGames'] || 'PLAYED'

  const { data: UserGamesResponse } = useQuery<UserGamesResponse>({
    queryKey: ['userGames', userId, page, search, filter],
    queryFn: async () => api.getUserGames(page, search, filter),
    placeholderData: keepPreviousData
  })

  const gamesForPage: GameBase[] = UserGamesResponse?.games[filter] ?? []

  const totalOfThisStatus =
    UserGamesResponse?.totalPerStatus.find(t => t.status === filter)
      ?.totalGames ?? 0

  const totalPages = Math.ceil(totalOfThisStatus / 18)

  if (!UserGamesResponse) {
    return null
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())

    url.searchParams.set('page', String(page))

    window.history.pushState({}, '', url)
    setPage(page)
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())

    url.searchParams.set('search', search)

    window.history.pushState({}, '', url)

    setSearch(search)
  }

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

  function handleClearSearch() {
    setCurrentSearch('')
    setCurrentPage(1)
  }

  return (
    <>
      <div className="flex min-h-screen bg-[#1A1C26]">
        <div className="flex-1 flex flex-col md:ml-0">
          <SideBar />
          <div ref={topRef} />

          <div className="flex flex-col items-center justify-center w-full px-6 md:px-6 lg:px-8">
            <div className="flex gap-3 items-center justify-center mt-4">
              <SearchInput value={search} onChange={onSearchInputChange} />
            </div>

            <div className="flex flex-col items-center mt-4 w-full max-w-7xl">
              <div className="flex flex-col w-full bg-[#272932] rounded-lg">
                <div className="py-4 px-4 xl:px-7">
                  <GamesGrid
                    games={gamesForPage}
                    search={search}
                    onClearSearch={handleClearSearch}
                  />
                </div>
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalOfThisStatus}
                itemsPerPage={gamesForPage.length}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
