import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IconButton } from '../components/iconButton'
import SideBar from '../components/sideBar'
import { UserGameCard } from '../components/userGamesComponents/userGameCard'
import { useApi } from '../hooks/useApi'
import type { UserGamesResponse } from '../types/user'

export function PlayingGamesPage() {
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

  const api = useApi()
  const userId = api.getUserIdFromToken()
  const filter = 2

  const { data: UserGamesResponse } = useQuery<UserGamesResponse>({
    queryKey: ['userGames', userId, page, search, filter],
    queryFn: async () => api.getUserGames(userId, page, search, filter),
    placeholderData: keepPreviousData,
  })

  if (!UserGamesResponse) {
    return null
  }

  const totalGamesPlaying = UserGamesResponse.totalPerStatus.find(
    total => total.statusId === 2
  )

  if (!totalGamesPlaying) {
    return null
  }

  const totalPages = Math.ceil(totalGamesPlaying?.totalGames / 18)

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
          <div className=" left-[20rem] top-[2rem] w-[30rem] mx-44 mt-10">
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
          <div className="flex flex-col mt-8 bg-[#272932] w-[1500px] min-h-[300px] p-6">
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-6 gap-4">
                <UserGameCard userGames={UserGamesResponse.userGames} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 pt-5 pb-5">
            <p className="text-[#FFFFFF]">
              Mostrando {UserGamesResponse.userGames.length} de{' '}
              {totalGamesPlaying?.totalGames} items
            </p>
            <span className="text-[#FFFFFF]">
              Página {page} de {totalPages}
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
