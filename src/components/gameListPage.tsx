import type { ChangeEvent } from 'react'
import { GamesGrid } from './gamesComponents/gamesGrid'
import { Pagination } from './pagination'
import type { UseGamesProps } from '../hooks/useGames'
import { SortControls } from './sorting'
import type {
  GameBase,
  GameStatusEnum,
  UserGamesResponse
} from '../types/games'

type SortField = 'gameName' | 'dateRelease'
type SortOrder = 'asc' | 'desc'

interface GameListProps {
  games: UseGamesProps | UserGamesResponse
  page: number
  setPage: (page: number) => void
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
  sortField: SortField
  setSortField: (field: SortField) => void
  filterField?: GameStatusEnum
  setFilterField?: (filterField: GameStatusEnum) => void
  currentStatus?: string
  onFilterChange?: (filter: GameStatusEnum | '') => void
  isUserLibrary?: boolean
}

export function GameListPage({
  games,
  setPage,
  page,
  sortOrder,
  setSortOrder,
  sortField,
  setSortField,
  filterField,
  setFilterField,
  currentStatus,
  onFilterChange,
  isUserLibrary
}: GameListProps) {
  const isGamesArray = Array.isArray(games.games)
  const gamesArray: GameBase[] = isGamesArray
    ? (games.games as GameBase[])
    : Object.values(games.games as Record<string, GameBase[]>).flat()

  const totalGames =
    'total' in games
      ? games.total
      : currentStatus
        ? (games.totalPerStatus?.find(s => s.status === currentStatus)
            ?.totalGames ?? 0)
        : (games.totalPerStatus?.reduce((sum, s) => sum + s.totalGames, 0) ?? 0)

  const safeTotal =
    typeof totalGames === 'number' && !Number.isNaN(totalGames) ? totalGames : 0
  const safePage =
    typeof page === 'number' && !Number.isNaN(page) && page > 0 ? page : 1
  const totalPages = Math.ceil(safeTotal / 36) || 1

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

      <div className="bg-[#1F2029] border border-[#2A2B36] rounded-lg py-4 px-4 xl:px-6">
        <GamesGrid games={gamesArray} />
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
