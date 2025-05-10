interface CategoriesDivProps {
  categoryName: string
}

export function CategoriesDiv({ categoryName }: CategoriesDivProps) {
  return (
    <div
      className="bg-gray-800 border-2 border-gray-600 rounded-lg px-2 md:px-4 
    md:py-1 lg:py-2 flex items-center justify-center"
    >
      <p className="text-slate-400 md:text-lg lg:text-2xl font-normal">
        {categoryName}
      </p>
    </div>
  )
}
