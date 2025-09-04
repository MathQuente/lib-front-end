import { SideBar } from '../components/sideBar'

import { ArrowDown, ArrowUp } from 'lucide-react'

import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import { ToastContainer } from 'react-toastify'

import { useGames } from '../hooks/useGames'
import { SearchInput } from '../components/searchInput'
import { Pagination } from '../components/pagination'
import { GamesGrid } from '../components/gamesComponents/gamesGrid'

type SortField = 'gameName' | 'dateRelease'
type SortOrder = 'asc' | 'desc'

export function Games() {
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

  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [sortField, setSortField] = useState<SortField>('gameName')

  const { GamesResponse } = useGames(page, search, sortField, sortOrder)

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

  function onSortFieldChange(event: ChangeEvent<HTMLSelectElement>) {
    console.log(event.target.value)
    const value = event.target.value as SortField
    setSortField(value)
  }

  function setSortOrderAsc() {
    setSortOrder('asc')
  }

  function setSortOrderDesc() {
    setSortOrder('desc')
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
              <div className="flex flex-row gap-4 mb-2 w-full justify-end">
                <div className="flex items-center gap-2">
                  <h1 className="text-[#8F8F8F] text-sm whitespace-nowrap">
                    Ordenar por:
                  </h1>

                  <div className="flex flex-col items-center">
                    <div className="relative inline-block group">
                      <button
                        type="button"
                        onClick={setSortOrderAsc}
                        className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
                          sortOrder === 'asc'
                            ? 'text-[#6930CD]'
                            : 'text-[#272932'
                        }`}
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <div
                        className="absolute left-1/2 bottom-full mb-2 w-max px-2 py-1 rounded-md 
                          bg-indigo-100 text-indigo-800 text-sm  transform -translate-x-1/2 translate-y-2 invisible opacity-0
                          transition-all duration-200 group-hover:-translate-y-2 group-hover:opacity-100 group-hover:visible pointer-events-none"
                      >
                        Ascending
                      </div>
                    </div>
                    <div className="relative inline-block group">
                      <button
                        type="button"
                        onClick={setSortOrderDesc}
                        className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
                          sortOrder === 'desc'
                            ? 'text-[#6930CD]'
                            : 'text-[#272932'
                        }`}
                      >
                        <ArrowDown className="size-4" />
                      </button>
                      <div
                        className="absolute left-1/2 bottom-full mb-2 w-max px-2 py-1 rounded-md 
                          bg-indigo-100 text-indigo-800 text-sm  transform -translate-x-1/2 translate-y-2 invisible opacity-0
                          transition-all duration-200 group-hover:-translate-y-2 group-hover:opacity-100 group-hover:visible pointer-events-none"
                      >
                        Descending
                      </div>
                    </div>
                  </div>

                  <select
                    value={sortField}
                    onChange={onSortFieldChange}
                    className="bg-[#272932] text-[#8F8F8F] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="gameName">Nome do Jogo</option>
                    <option value="dateRelease">Data de Lançamento</option>
                    <option value="rating">Avaliação</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col w-full bg-[#272932] rounded-lg">
                <div className="py-4 px-4 xl:px-7">
                  <GamesGrid
                    games={GamesResponse.games}
                    search={search}
                    onClearSearch={handleClearSearch}
                  />
                </div>
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={GamesResponse.total}
                itemsPerPage={GamesResponse.games.length}
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
