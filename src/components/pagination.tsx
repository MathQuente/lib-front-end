import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { IconButton } from './iconButton'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

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
    <div className="flex flex-col items-center gap-6 pt-5 pb-5">
      <span className="flex gap-1">
        <p className="text-[#6930CD]">Mostrando</p>
        <p className="text-gray-500">{displayedItems}</p>
        <p className="text-[#6930CD]">de</p>
        <p className="text-gray-500">{totalItems}</p>
        <p className="text-[#6930CD]">items</p>
      </span>

      <span className="flex gap-1">
        <p className="text-[#6930CD]">Página</p>
        <p className="text-gray-500">{currentPage}</p>
        <p className="text-[#6930CD]">de</p>
        <p className="text-gray-500">{totalPages}</p>
        <p className="text-[#6930CD]">páginas</p>
      </span>

      <div className="flex gap-1.5">
        <IconButton onClick={goToFirstPage} disabled={currentPage === 1}>
          <ChevronsLeft
            className={`size-4 ${
              currentPage === 1 ? 'text-black' : 'text-[#6930CD]'
            }`}
          />
        </IconButton>

        <IconButton onClick={goToPreviousPage} disabled={currentPage === 1}>
          <ChevronLeft
            className={`size-4 ${
              currentPage === 1 ? 'text-black' : 'text-[#6930CD]'
            }`}
          />
        </IconButton>

        <IconButton
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight
            className={`size-4 ${
              currentPage === totalPages ? 'text-black' : 'text-[#6930CD]'
            }`}
          />
        </IconButton>

        <IconButton
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight
            className={`size-4 ${
              currentPage === totalPages ? 'text-black' : 'text-[#6930CD]'
            }`}
          />
        </IconButton>
      </div>
    </div>
  )
}
