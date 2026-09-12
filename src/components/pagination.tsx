import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { IconButton } from './iconButton'
import type { PaginationProps } from '../interfaces/ui'

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) {
  const displayedItems = Math.min(itemsPerPage, totalItems)

  function goToFirstPage() {
    onPageChange(1)
  }

  function goToLastPage() {
    onPageChange(totalPages)
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 pt-5 pb-5 text-sm">
      <p className="text-gray-400">
        Mostrando{' '}
        <span className="text-gray-200 font-medium">{displayedItems}</span> de{' '}
        <span className="text-gray-200 font-medium">{totalItems}</span> itens
        {' · '}
        página{' '}
        <span className="text-gray-200 font-medium">{currentPage}</span> de{' '}
        <span className="text-gray-200 font-medium">{totalPages}</span>
      </p>

      <div className="flex gap-1.5">
        <IconButton onClick={goToFirstPage} disabled={currentPage === 1}>
          <ChevronsLeft className="size-4 text-primary" />
        </IconButton>

        <IconButton onClick={goToPreviousPage} disabled={currentPage === 1}>
          <ChevronLeft className="size-4 text-primary" />
        </IconButton>

        <IconButton
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="size-4 text-primary" />
        </IconButton>

        <IconButton
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="size-4 text-primary" />
        </IconButton>
      </div>
    </div>
  )
}
