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
  return (
    <div className="flex flex-row gap-4 mb-2 w-full justify-between items-center">
      <div>
        <p className="text-[#8F8F8F] text-sm">{totalGames} Games</p>
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-[#8F8F8F] text-sm whitespace-nowrap">
          Ordenar por:
        </h1>

        <div className="flex flex-col items-center">
          <div className="relative inline-block group">
            <button
              type="button"
              onClick={() => onSortOrderChange('asc')}
              className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
                sortOrder === 'asc' ? 'text-[#6930CD]' : 'text-[#272932]'
              }`}
            >
              <ArrowUp className="size-4" />
            </button>
            <div className="absolute left-1/2 bottom-full mb-2 w-max px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-sm transform -translate-x-1/2 translate-y-2 invisible opacity-0 transition-all duration-200 group-hover:-translate-y-2 group-hover:opacity-100 group-hover:visible pointer-events-none">
              Ascending
            </div>
          </div>

          <div className="relative inline-block group">
            <button
              type="button"
              onClick={() => onSortOrderChange('desc')}
              className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
                sortOrder === 'desc' ? 'text-[#6930CD]' : 'text-[#272932]'
              }`}
            >
              <ArrowDown className="size-4" />
            </button>
            <div className="absolute left-1/2 bottom-full mb-2 w-max px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 text-sm transform -translate-x-1/2 translate-y-2 invisible opacity-0 transition-all duration-200 group-hover:-translate-y-2 group-hover:opacity-100 group-hover:visible pointer-events-none">
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
        {isUserLibrary && (
          <select
            value={filterField}
            onChange={onSortFilterField}
            className="bg-[#272932] text-[#8F8F8F] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
