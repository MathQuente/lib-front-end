import { Tag, Code, Building2 } from 'lucide-react'
import type { DetailsProps } from '../interfaces/games'

export function Details({ GameResponse }: DetailsProps) {
  const { game } = GameResponse

  const hasGenres = !!game.genres?.length
  const hasDevelopers = !!game.developers?.length
  const hasPublishers = !!game.publishers?.length

  if (!hasGenres && !hasDevelopers && !hasPublishers) return null

  return (
    <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-primary pl-3 uppercase tracking-wide mb-5">
        Detalhes
      </h2>

      <div className="flex flex-col gap-4">
        {hasGenres && (
          <div>
            <h3 className="text-xs text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Tag className="size-3.5" />
              Gêneros
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {game.genres.map(genre => (
                <span
                  key={genre}
                  className="inline-flex items-center px-2.5 py-1 bg-dark-bg-lighter border border-dark-border rounded-full text-sm text-gray-300"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasDevelopers && (
          <div>
            <h3 className="text-xs text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Code className="size-3.5" />
              Desenvolvedora
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {game.developers!.map(dev => (
                <span
                  key={dev}
                  className="inline-flex items-center px-2.5 py-1 bg-dark-bg-lighter border border-dark-border rounded-full text-sm text-gray-300"
                >
                  {dev}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasPublishers && (
          <div>
            <h3 className="text-xs text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              Publicadora
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {game.publishers!.map(pub => (
                <span
                  key={pub}
                  className="inline-flex items-center px-2.5 py-1 bg-dark-bg-lighter border border-dark-border rounded-full text-sm text-gray-300"
                >
                  {pub}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
