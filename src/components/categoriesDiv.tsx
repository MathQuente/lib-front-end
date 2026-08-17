import type { CategoriesDivProps } from '../interfaces/games'

export function CategoriesDiv({ categoryName }: CategoriesDivProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 bg-dark-bg-lighter border border-dark-border rounded-full text-sm text-gray-300">
      {categoryName}
    </span>
  )
}
