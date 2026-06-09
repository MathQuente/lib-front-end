import type { ChangeEvent } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { GameStatusEnum } from '../types/games'

type SortField = 'gameName' | 'dateRelease' | 'rating'
type SortOrder = 'asc' | 'desc'

interface SortControlsProps {
  sortField: SortField
  sortOrder: SortOrder
  filterField: GameStatusEnum | undefined
  onSortFieldChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onSortOrderChange: (order: SortOrder) => void
  onSortFilterField: (event: ChangeEvent<HTMLSelectElement>) => void
  totalGames: number
  isUserLibrary?: boolean
}

const selectClass =
  'bg-[#13141C] text-sm text-gray-300 rounded-lg px-3 py-1.5 border border-[#2A2B36] focus:border-[#7A38CA] focus:outline-none transition-colors duration-150 cursor-pointer'

export function SortControls({
  sortField,
  sortOrder,
  filterField,
  totalGames,
  onSortFieldChange,
  onSortOrderChange,
  onSortFilterField,
  isUserLibrary
}: SortControlsProps) {
  const toggleOrder = () =>
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
      <p className="text-gray-500 text-sm">
        {totalGames} {totalGames === 1 ? 'jogo' : 'jogos'}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-gray-600 text-xs whitespace-nowrap">
          Ordenar por
        </span>

        <select
          value={sortField}
          onChange={onSortFieldChange}
          className={selectClass}
        >
          <option value="gameName">Nome</option>
          <option value="dateRelease">Lançamento</option>
          <option value="rating">Avaliação</option>
        </select>

        <button
          type="button"
          title={sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
          onClick={toggleOrder}
          className="p-1.5 text-[#7A38CA] hover:text-[#9D52E8] border border-[#2A2B36] hover:border-[#7A38CA] rounded-lg transition-colors duration-150"
        >
          {sortOrder === 'asc' ? (
            <ArrowUp className="size-4" />
          ) : (
            <ArrowDown className="size-4" />
          )}
        </button>

        {isUserLibrary && (
          <select
            value={filterField}
            onChange={onSortFilterField}
            className={selectClass}
          >
            <option value={GameStatusEnum.Played}>Played</option>
            <option value={GameStatusEnum.Playing}>Playing</option>
            <option value={GameStatusEnum.Backlog}>Backlog</option>
            <option value={GameStatusEnum.Wishlist}>Wishlist</option>
          </select>
        )}
      </div>
    </div>
  )
}
