import { Building, Star, Tag } from 'lucide-react'
import { CategoriesDiv } from './categoriesDiv'
import type { DetailsProps } from '../interfaces/games'

export function Details({ GameResponse }: DetailsProps) {
  const { game } = GameResponse

  return (
    <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-primary pl-3 uppercase tracking-wide mb-5">
        Detalhes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h3 className="text-xs text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Building className="size-3.5" />
            Desenvolvedor
          </h3>
          <div className="flex flex-col gap-1">
            {game.gameStudios.map(studio => (
              <span key={studio.id} className="text-gray-300 text-sm">
                {studio.studioName}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Star className="size-3.5" />
            Publicadora
          </h3>
          <div className="flex flex-col gap-1">
            {game.publishers.map(publisher => (
              <span key={publisher.id} className="text-gray-300 text-sm">
                {publisher.publisherName}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xs text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Tag className="size-3.5" />
            Categorias
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {game.categories.map(category => (
              <CategoriesDiv
                key={category.id}
                categoryName={category.categoryName}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
