import { type ChangeEvent, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { GamesGrid } from './gamesComponents/gamesGrid'
import { Pagination } from './pagination'
import { SortControls } from './sorting'
import type { GameStatusEnum } from '../types/games'
import type { GameListProps, SortField, SortOrder } from '../interfaces/games'
import { pushListState } from '../utils/listHistory'
import { parsePage } from '../utils/parsePage'

const SORT_FIELDS: SortField[] = [
  'name',
  'releaseDate',
  'rating',
  'hoursPlayed',
  'completedAt'
]

export function GameListPage({
  games,
  setPage,
  page,
  pageSize = 20,
  sortOrder,
  setSortOrder,
  sortField,
  setSortField,
  defaultSort,
  filterField,
  setFilterField,
  onFilterChange,
  isUserLibrary,
  emptyState
}: GameListProps) {
  const gamesArray = games.games

  const safeTotal =
    typeof games.total === 'number' && !Number.isNaN(games.total)
      ? games.total
      : 0
  const safePage =
    typeof page === 'number' && !Number.isNaN(page) && page > 0 ? page : 1
  const totalPages = Math.ceil(safeTotal / pageSize) || 1
  // Lista vazia com total maior que zero não é um vazio de verdade: é uma página além do total
  // ou a resposta anterior mantida (keepPreviousData) enquanto a página certa carrega.
  // Nesses casos mostra o esqueleto, e não o estado vazio.
  const isAwaitingPage = gamesArray.length === 0 && safeTotal > 0

  useEffect(() => {
    if (safeTotal > 0 && safePage > totalPages) {
      const url = new URL(window.location.toString())
      url.searchParams.set('page', String(totalPages))
      window.history.replaceState(window.history.state, '', url)
      setPage(totalPages)
      toast.info(`A página ${safePage} não existe. Mostrando a última.`, {
        toastId: 'page-out-of-range'
      })
    }
  }, [safeTotal, safePage, totalPages, setPage])

  const fallbackSort = useRef(
    defaultSort ?? { field: sortField, order: sortOrder }
  )
  if (defaultSort) fallbackSort.current = defaultSort

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    function syncFromUrl() {
      const params = new URL(window.location.toString()).searchParams
      const urlField = params.get('sortField') as SortField | null
      const urlOrder = params.get('sortOrder')

      setPage(parsePage(params.get('page')))
      setSortField(
        urlField && SORT_FIELDS.includes(urlField)
          ? urlField
          : fallbackSort.current.field
      )
      setSortOrder(
        urlOrder === 'asc' || urlOrder === 'desc'
          ? urlOrder
          : fallbackSort.current.order
      )
      window.scrollTo(0, 0)
    }

    window.addEventListener('popstate', syncFromUrl)
    return () => {
      window.removeEventListener('popstate', syncFromUrl)
      window.history.scrollRestoration = previousRestoration
    }
  }, [setPage, setSortField, setSortOrder])

  function setCurrentPage(p: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(p))
    pushListState(url)
    setPage(p)
    window.scrollTo(0, 0)
  }

  function onSortFieldChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as SortField
    const url = new URL(window.location.toString())
    url.searchParams.set('sortField', value)
    pushListState(url)
    setSortField(value)
  }

  function onSortOrderChange(order: SortOrder) {
    const url = new URL(window.location.toString())
    url.searchParams.set('sortOrder', order)
    pushListState(url)
    setSortOrder(order)
  }

  function onSortFilterField(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as GameStatusEnum
    if (onFilterChange) onFilterChange(value)
    else setFilterField?.(value)
  }

  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      <SortControls
        onSortFieldChange={onSortFieldChange}
        onSortOrderChange={onSortOrderChange}
        onSortFilterField={onSortFilterField}
        filterField={filterField}
        sortField={sortField}
        sortOrder={sortOrder}
        isUserLibrary={isUserLibrary}
        totalGames={safeTotal}
      />

      {isAwaitingPage ? (
        <div
          className="grid grid-cols-4 sm:grid-cols-6 2xl:grid-cols-8 p-2 gap-x-1 sm:gap-x-2 gap-y-4 animate-pulse"
          aria-hidden="true"
        >
          {Array.from({ length: 18 }, (_, i) => `sk${i}`).map(k => (
            <div
              key={k}
              className="aspect-[7/10] w-full rounded-lg bg-dark-bg-lighter"
            />
          ))}
        </div>
      ) : (
        <GamesGrid games={gamesArray} emptyState={emptyState} />
      )}

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={safeTotal}
        itemsPerPage={gamesArray.length}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
