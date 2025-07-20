interface CategoriesDivProps {
  categoryName: string
}

export function CategoriesDiv({ categoryName }: CategoriesDivProps) {
  return (
    <span className="px-4 py-2 bg-gradient-to-r from-[#4D23A5] to-[#783FCF] rounded-lg">
      <p className="text-slate-400 text-sm font-medium">{categoryName}</p>
    </span>
  )
}
