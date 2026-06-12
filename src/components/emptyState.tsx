import { Search } from 'lucide-react'
import type { EmptyStateProps } from '../interfaces/ui'

export function EmptyState({
  title = 'Nenhum resultado encontrado',
  description
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-16 text-center">
      <Search className="size-12 text-gray-700 mb-4" />
      <h3 className="text-white font-medium mb-1">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs">{description}</p>
    </div>
  )
}
