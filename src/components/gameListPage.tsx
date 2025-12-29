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
  setSortOrder: (SortOrder: SortOrder) => void
  sortField: SortField
  setSortField: (SortField: SortField) => void
  filterField?: GameStatusEnum
  setFilterField?: (filterField: GameStatusEnum) => void
  currentStatus?: string
  onFilterChange?: (filter: GameStatusEnum) => void
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
    : Object.values(
        games.games as {
          PLAYED: GameBase[]
          PLAYING: GameBase[]
          BACKLOG: GameBase[]
          WISHLIST: GameBase[]
        }
      ).flat()

  const totalGames =
    'total' in games
      ? games.total
      : currentStatus
      ? games.totalPerStatus?.find(status => status.status === currentStatus)
          ?.totalGames || 0
      : games.totalPerStatus?.reduce(
          (sum, status) => sum + status.totalGames,
          0
        ) || 0

  const safeTotal =
    typeof totalGames === 'number' && !Number.isNaN(totalGames) ? totalGames : 0
  const safeGamesArrayLength = gamesArray ? gamesArray.length : 0
  const safePage =
    typeof page === 'number' && !Number.isNaN(page) && page > 0 ? page : 1

  const totalPages = Math.ceil(safeTotal / 36) || 1

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
    window.history.pushState({}, '', url)
    setPage(page)
  }

  function onSortFieldChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as SortField
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

  function onSortFilterField(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as GameStatusEnum

    if (onFilterChange) {
      onFilterChange(value)
    } else if (setFilterField) {
      setFilterField(value)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center mt-4 w-full max-w-7xl">
        <SortControls
          onSortFieldChange={onSortFieldChange}
          onSortOrderChange={onSortOrderChange}
          onSortFilterField={onSortFilterField}
          filterField={filterField}
          sortField={sortField}
          sortOrder={sortOrder}
          isUserLibrary={isUserLibrary}
          totalGames={safeGamesArrayLength}
        />
        <div className="flex flex-col w-full bg-[#272932] rounded-lg">
          <div className="py-4 px-4 xl:px-7">
            <GamesGrid games={gamesArray} />
          </div>
        </div>
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={safeTotal}
          itemsPerPage={safeGamesArrayLength}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
