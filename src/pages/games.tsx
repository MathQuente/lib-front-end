import { SideBar } from '../components/sideBar'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { ToastContainer } from 'react-toastify'

import { IconButton } from '../components/iconButton'
import { useApi } from '../hooks/useApi'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { GamesResponse } from '../types/games'
import { GameCard } from '../components/gamesComponents/gameCard'

export function Games() {
  const api = useApi()
  const topRef = useRef<HTMLDivElement>(null)
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

  const { data: GamesResponse } = useQuery<GamesResponse>({
    queryKey: ['games', page, search],
    queryFn: async () => api.getGames(page, search),
    placeholderData: keepPreviousData,
  })

  if (!GamesResponse) {
    return null
  }

  const totalPages = Math.ceil(GamesResponse?.total / 36)

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: 'instant' })
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())

    url.searchParams.set('page', String(page))

    window.history.pushState({}, '', url)
    setPage(page)

    scrollToTop()
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
    if (page < totalPages) {
      setCurrentPage(page + 1)
    }
  }

  function goToPreviousPage() {
    if (page > 1) {
      setCurrentPage(page - 1)
    }
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-screen bg-[#1A1C26]">
        <SideBar />

        <div ref={topRef} />
        <div className="flex gap-3 items-center justify-center">
          <div className="mt-10">
            <CiSearch
              className="size-6 text-[#8F8F8F] absolute top-[3.725rem] 
            left-[6rem] md:left-[16.8rem] lg:left-[25rem] lg:top-[3.7rem] xl:left-[33rem] 2xl:left-[52.5rem]"
            />
            <input
              onChange={onSearchInputChange}
              value={search}
              className="bg-[#272932] text-[#8F8F8F] rounded-2xl block w-full sm:w-72 h-[62px] pl-[62px] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="flex flex-col items-center mt-4 flex-1">
          <div className="flex flex-col xl:ml-52 xl:mr-20 2xl:ml-48 bg-[#272932] w-[350px] sm:w-[500px] md:w-[640px] lg:w-[800px] xl:w-[1100px] 2xl:min-w-[1300px] flex-grow">
            <div className="py-6 px-4 xl:px-7">
              <div className="grid grid-cols-6 gap-x-3 gap-y-3 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-3 md:grid-cols-3 md:gap-x-6 md:gap-y-4 lg:grid-cols-6 lg:gap-y-4 xl:gap-y-4 xl:grid-cols-6 2xl:grid-cols-6">
                <GameCard games={GamesResponse.games} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 pt-5 pb-5">
            <span className="flex gap-1">
              <p className="text-[#6930CD]">Mostrando</p>
              <p className="text-gray-500">{GamesResponse.games.length}</p>
              <p className="text-[#6930CD]">de</p>
              <p className="text-gray-500"> {GamesResponse.total}</p>
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
      <ToastContainer />
    </>
  )
}
