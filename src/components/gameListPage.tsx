import type { ChangeEvent } from 'react'
import { GamesGrid } from './gamesComponents/gamesGrid'
import { Pagination } from './pagination'
import { SortControls } from './sorting'
import type { GameStatusEnum } from '../types/games'
import type { GameListProps, SortField, SortOrder } from '../interfaces/games'

export function GameListPage({
  games,
  setPage,
  page,
  pageSize = 20,
  sortOrder,
  setSortOrder,
  sortField,
  setSortField,
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

  function setCurrentPage(p: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(p))
    window.history.pushState({}, '', url)
    setPage(p)
  }

  function onSortFieldChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as SortField
    const url = new URL(window.location.toString())
    url.searchParams.set('field', value)
    window.history.pushState({}, '', url)
    setSortField(value)
  }

  function onSortOrderChange(order: SortOrder) {
    const url = new URL(window.location.toString())
    url.searchParams.set('order', order)
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

      <div className="bg-dark-bg-light border border-dark-border rounded-lg py-4 px-4 xl:px-6">
        <GamesGrid games={gamesArray} emptyState={emptyState} />
      </div>

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
