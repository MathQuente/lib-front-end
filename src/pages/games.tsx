import { SideBar } from '../components/sideBar'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { ToastContainer } from 'react-toastify'

import { IconButton } from '../components/iconButton'
import { useApi } from '../hooks/useApi'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { GamesResponse } from '../types/games'
import { GameCard } from '../components/gamesComponents/gameCard'

export function Games() {
  const api = useApi()
  // const topRef = useRef<HTMLDivElement>(null)
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

  const totalPages = Math.ceil(GamesResponse?.total / 18)

  // function scrollToTop() {
  //   topRef.current?.scrollIntoView({ behavior: 'instant' })
  // }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())

    url.searchParams.set('page', String(page))

    window.history.pushState({}, '', url)
    setPage(page)

    // scrollToTop()
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
        {/* <div ref={topRef} /> */}
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
          <div className="flex flex-col bg-[#272932] w-[1550px] h-[1085px] p-9">
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-6 gap-5">
                <GameCard games={GamesResponse.games} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 pt-5 pb-5">
            <p className="text-[#FFFFFF]">
              Mostrando {GamesResponse.games.length} de {GamesResponse.total}{' '}
              items
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
      <ToastContainer />
    </>
  )
}
