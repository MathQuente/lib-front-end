import { ArrowDown, ArrowUp } from 'lucide-react'
import { GameStatusEnum } from '../types/games'
import type { SortControlsProps } from '../interfaces/games'

const selectClass =
  'bg-[#13141C] text-sm text-gray-300 rounded-lg px-3 py-1.5 border border-dark-border focus:border-primary focus:outline-none transition-colors duration-150 cursor-pointer'

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
          <option value="name">Nome</option>
          <option value="releaseDate">Lançamento</option>
          <option value="rating">Avaliação</option>
        </select>

        <button
          type="button"
          title={sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
          onClick={toggleOrder}
          className="p-1.5 text-primary hover:text-primary-light border border-dark-border hover:border-primary rounded-lg transition-colors duration-150"
        >
          {sortOrder === 'asc' ? (
            <ArrowUp className="size-4" />
          ) : (
            <ArrowDown className="size-4" />
          )}
        </button>

        {isUserLibrary && (
          <select
            value={filterField ?? ''}
            onChange={onSortFilterField}
            className={selectClass}
          >
            <option value="">Todos</option>
            <option value={GameStatusEnum.Played}>Jogado</option>
            <option value={GameStatusEnum.Playing}>Jogando</option>
            <option value={GameStatusEnum.Backlog}>Backlog</option>
            <option value={GameStatusEnum.Wishlist}>Lista de Desejos</option>
          </select>
        )}
      </div>
    </div>
  )
}
