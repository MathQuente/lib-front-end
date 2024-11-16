interface CategoriesDivProps {
  categoryName: string
}

export function CategoriesDiv({ categoryName }: CategoriesDivProps) {
  return (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg px-3 py-2 flex items-center justify-center">
      <p className="text-slate-400 text-xl font-normal">{categoryName}</p>
    </div>
  )
}
