import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IconButton } from '../components/iconButton'
import { SideBar } from '../components/sideBar'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useApi } from '../hooks/useApi'
import type { GameBase, UserGamesResponse } from '../types/games'
import { useAuth } from '../hooks/useAuth'
import { GameStatusEnum } from '../types/games'
import { useParams } from 'react-router-dom'
import { GameCard } from '../components/gamesComponents/gameCard'

type StatusKey =
  | 'playedGames'
  | 'playingGames'
  | 'backlogGames'
  | 'wishlistGames'

export function UserGamesPageByStatus() {
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

  function goToFirstPage() {
    setCurrentPage(1)
  }

  function goToLastPage() {
    setCurrentPage(totalPages)
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1)
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-screen bg-[#1A1C26]">
        <SideBar />

        <div className="flex gap-3 items-center">
          <div className="left-[20rem] top-[2rem] w-[30rem] mx-44 mt-10">
            <CiSearch className="size-6 text-[#8F8F8F] absolute top-[3.625rem] left-[12.5rem]" />
            <input
              onChange={onSearchInputChange}
              value={search}
              className="bg-[#272932] text-[#8F8F8F] rounded-2xl block w-full h-[62px] pl-[62px]"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="flex flex-col items-center mt-4">
          <div className="flex flex-col ml-20 sm:ml-20 md:ml-20 lg:ml-52 lg:mr-20 xl:ml-52 xl:mr-20 2xl:ml-48 bg-[#272932] w-[400px] sm:w-[500px] md:w-[650px] lg:w-[750px] xl:w-[1050px] 2xl:min-w-[1300px] min-h-[1085px]">
            <div className="flex justify-center py-5 px-4">
              <div className="grid grid-cols-3 gap-x-3 gap-y-3 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-3 md:grid-cols-4 md:gap-x-4 md:gap-y-4 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-4 xl:grid-cols-6 xl:gap-5">
                {gamesForPage.map(game => (
                  <GameCard game={game} key={game.id} size='medium' enableModal />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 pt-5 pb-5">
            <span className="flex gap-1">
              <p className="text-[#6930CD]">Mostrando</p>
              <p className="text-gray-500">{gamesForPage.length}</p>
              <p className="text-[#6930CD]">de</p>
              <p className="text-gray-500"> {totalOfThisStatus}</p>
              <p className="text-[#6930CD]">items</p>
            </span>
            <span className="flex gap-1">
              <p className="text-[#6930CD]">Página</p>
              <p className="text-gray-500">{page}</p>
              <p className="text-[#6930CD]">de</p>
              <p className="text-gray-500">{totalPages}</p>
              <p className="text-[#6930CD]">items</p>
            </span>
            <div className="flex gap-1.5">
              <IconButton onClick={goToFirstPage} disabled={page === 1}>
                <ChevronsLeft
                  className={`${
                    page === 1 ? 'size-4 text-black' : 'size-4 text-[#6930CD]'
                  }`}
                />
              </IconButton>
              <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                <ChevronLeft
                  className={`${
                    page === 1 ? 'size-4 text-black' : 'size-4 text-[#6930CD]'
                  }`}
                />
              </IconButton>
              <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                <ChevronRight
                  className={`size-4 ${
                    page === totalPages ? 'text-black' : 'text-[#6930CD]'
                  }`}
                />
              </IconButton>
              <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                <ChevronsRight
                  className={`size-4 ${
                    page === totalPages ? 'text-black' : 'text-[#6930CD]'
                  }`}
                />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
