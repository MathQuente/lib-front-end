import { SideBar } from '../components/sideBar'

import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'

import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { ToastContainer } from 'react-toastify'

import { IconButton } from '../components/iconButton'

import { GameCard } from '../components/gamesComponents/gameCard'
import { useGames } from '../hooks/useGames'

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

  return (
    <>
      <div className="flex min-h-screen bg-[#1A1C26]">
        <SideBar />

        <div className="flex-1 flex flex-col md:ml-0">
          <div ref={topRef} />

          <div className="flex flex-col items-center justify-center w-full px-6 md:px-6 lg:px-8">
            <div className="flex gap-3 items-center justify-center mt-10">
              <div className="relative">
                <div className="relative w-full sm:w-72">
                  <CiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 size-6 text-[#8F8F8F] pointer-events-none" />
                  <input
                    onChange={onSearchInputChange}
                    value={search}
                    className="bg-[#272932] text-[#8F8F8F] rounded-2xl block w-full h-[62px] pl-[62px] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    type="text"
                    placeholder="Search"
                  />
                </div>
              </div>
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
                  {GamesResponse.games.length > 0 ? (
                    <div className="grid grid-cols-3 gap-x-2 gap-y-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6 xl:gap-4 2xl:grid-cols-6 2xl:gap-4">
                      {GamesResponse.games.map(game => (
                        <GameCard
                          size="medium"
                          key={game.id}
                          game={game}
                          enableModal
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full py-16">
                      <div className="text-center space-y-4">
                        <CiSearch className="mx-auto size-16 text-[#8F8F8F]" />
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-white">
                            Nenhum jogo encontrado
                          </h3>
                          {search ? (
                            <p className="text-[#8F8F8F] max-w-md">
                              Não encontramos jogos que correspondam à sua busca
                              por{' '}
                              <span className="text-[#6930CD] font-medium">
                                "{search}"
                              </span>
                              . Tente usar termos diferentes ou verifique a
                              ortografia.
                            </p>
                          ) : (
                            <p className="text-[#8F8F8F] max-w-md">
                              Não há jogos disponíveis no momento. Tente
                              novamente mais tarde.
                            </p>
                          )}
                        </div>
                        {search && (
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentSearch('')
                              setCurrentPage(1)
                            }}
                            className="mt-4 px-6 py-2 bg-[#6930CD] text-white rounded-lg hover:bg-[#5a28a8] transition-colors duration-200"
                          >
                            Limpar pesquisa
                          </button>
                        )}
                      </div>
                    </div>
                  )}
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
                        page === 1
                          ? 'size-4 text-black'
                          : 'size-4 text-[#6930CD]'
                      }`}
                    />
                  </IconButton>
                  <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                    <ChevronLeft
                      className={`${
                        page === 1
                          ? 'size-4 text-black'
                          : 'size-4 text-[#6930CD]'
                      }`}
                    />
                  </IconButton>
                  <IconButton
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                  >
                    <ChevronRight
                      className={`size-4 ${
                        page === totalPages ? 'text-black' : 'text-[#6930CD]'
                      }`}
                    />
                  </IconButton>
                  <IconButton
                    onClick={goToLastPage}
                    disabled={page === totalPages}
                  >
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
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
