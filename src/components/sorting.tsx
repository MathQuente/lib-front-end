import { ArrowDown, ArrowUp } from 'lucide-react'
import { GameStatusEnum } from '../types/games'
import type { SortControlsProps } from '../interfaces/games'

const selectClass =
  'bg-dark-bg-darker text-xs sm:text-sm text-gray-300 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 border border-dark-border focus:border-primary outline-2 outline-offset-1 outline-transparent focus-visible:outline-primary-light transition-colors duration-150 cursor-pointer'

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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
      <p className="text-gray-400 text-sm">
        {totalGames} {totalGames === 1 ? 'jogo' : 'jogos'}
      </p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-center gap-1.5">
          <span className="shrink-0 text-gray-400 text-xs whitespace-nowrap">
            Ordenar:
          </span>

          <select
            value={sortField}
            onChange={onSortFieldChange}
            className={`${selectClass} w-24 sm:w-auto`}
          >
            <option value="name">Nome</option>
            <option value="releaseDate">Lançamento</option>
            <option value="rating">Avaliação</option>
          </select>

          <button
            type="button"
            title={sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
            aria-label={
              sortOrder === 'asc'
                ? 'Ordem crescente, clique para inverter'
                : 'Ordem decrescente, clique para inverter'
            }
            onClick={toggleOrder}
            className="shrink-0 p-1 text-primary hover:text-primary-light border border-dark-border hover:border-primary rounded-lg transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
          >
            {sortOrder === 'asc' ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowDown className="size-3.5" />
            )}
          </button>
        </div>

        {isUserLibrary && (
          <div className="flex items-center gap-1.5">
            <span className="shrink-0 text-gray-400 text-xs whitespace-nowrap">
              Status:
            </span>
            <select
              value={filterField ?? ''}
              onChange={onSortFilterField}
              className={`${selectClass} w-24 sm:w-auto`}
            >
              <option value="">Todos</option>
              <option value={GameStatusEnum.Played}>Jogado</option>
              <option value={GameStatusEnum.Playing}>Jogando</option>
              <option value={GameStatusEnum.Backlog}>Pendentes</option>
              <option value={GameStatusEnum.Wishlist}>Lista de desejos</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
