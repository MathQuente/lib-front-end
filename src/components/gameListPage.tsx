import { type ChangeEvent, useEffect, useRef } from 'react'
import { GamesGrid } from './gamesComponents/gamesGrid'
import { Pagination } from './pagination'
import { SortControls } from './sorting'
import type { GameStatusEnum } from '../types/games'
import type { GameListProps, SortField, SortOrder } from '../interfaces/games'

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

  const fallbackSort = useRef(
    defaultSort ?? { field: sortField, order: sortOrder }
  )
  if (defaultSort) fallbackSort.current = defaultSort

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    function syncFromUrl() {
      const params = new URL(window.location.toString()).searchParams
      const urlPage = Number(params.get('page'))
      const urlField = params.get('sortField') as SortField | null
      const urlOrder = params.get('sortOrder')

      setPage(urlPage > 0 ? urlPage : 1)
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
    window.history.pushState({}, '', url)
    setPage(p)
    window.scrollTo(0, 0)
  }

  function onSortFieldChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as SortField
    const url = new URL(window.location.toString())
    url.searchParams.set('sortField', value)
    window.history.pushState({}, '', url)
    setSortField(value)
  }

  function onSortOrderChange(order: SortOrder) {
    const url = new URL(window.location.toString())
    url.searchParams.set('sortOrder', order)
    window.history.pushState({}, '', url)
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

      <GamesGrid games={gamesArray} emptyState={emptyState} />

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
