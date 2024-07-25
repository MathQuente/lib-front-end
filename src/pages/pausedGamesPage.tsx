import { useLocation } from 'react-router-dom'
import { PlayingGames } from '../components/userGamesComponents/playingGames'
import SideBar from '../components/sideBar'
import { CiSearch } from 'react-icons/ci'
import { ChangeEvent, useState } from 'react'
import { IconButton } from '../components/iconButton'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { PausedGames } from '../components/userGamesComponents/pausedGames'

export function PausedGamesPage() {
  const location = useLocation()
  const total = location.state.length
  const totalPages = Math.ceil(total / 15)

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

        <div className="flex flex-col justify-center items-center ml-32 mr-10 mt-8">
          <PausedGames pausedGames={location.state} />
          <div className="flex items-center gap-6 pt-5 pb-5">
            <p className="text-[#FFFFFF]">
              Mostrando {PlayingGames?.length} de {total} items
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
                  className={`${
                    total === totalPages
                      ? 'size-4 text-[#6930CD]'
                      : 'size-4 text-black'
                  }`}
                />
              </IconButton>
              <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                <ChevronsRight
                  className={`${
                    total === totalPages
                      ? 'size-4 text-[#6930CD]'
                      : 'size-4 text-black'
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
