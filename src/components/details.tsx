import { Building, Star, Tag } from 'lucide-react'
import type { GameResponse } from '../types/games'
import { CategoriesDiv } from './categoriesDiv'

interface DetailsProps {
  GameResponse: GameResponse
}

export function Details({ GameResponse }: DetailsProps) {
  return (
    <div className="bg-[#272932]/50 backdrop-blur-sm rounded-2xl p-6 borer border-gray-700/50">
      <h2 className="text-2xl font-semibold mb-6 text-gray-200">Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-200">
            <Building className="w-5 h-5" />
            Developer
          </h3>
          <div className="spcace-y-2">
            {GameResponse.game.gameStudios.map(studio => (
              <span
                key={studio.id}
                className="block px-3 py-2 bg-gray-700/50 rounded-lg"
              >
                <p className="text-gray-300 leading-relaxed text-lg">
                  {studio.studioName}
                </p>
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-200">
            <Star className="w-5 h-5" />
            Publisher
          </h3>
          <div className="space-y-2">
            {GameResponse.game.publishers.map(publisher => (
              <span
                key={publisher.id}
                className="block px-3 py-2 bg-gray-700/50 rounded-lg"
              >
                <p className="text-gray-300 leading-relaxed text-lg">
                  {publisher.publisherName}
                </p>
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-200">
            <Tag className="w-5 h-5" />
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {GameResponse.game.categories.map(category => (
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
