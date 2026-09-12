import { useState } from 'react'
import { Crown, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from './sectionHeading'
import { Pagination } from './pagination'
import { getGameTag } from './gamesComponents/gameCard'
import type { DlcAndOriginalGameAreaProps } from '../interfaces/games'

const DLCS_PER_PAGE = 5

export function DlcAndOriginalGameArea({
  game,
  relatedGames
}: DlcAndOriginalGameAreaProps) {
  const [page, setPage] = useState(1)

  if (!game.parentGame && relatedGames.length === 0) return null

  const totalPages = Math.ceil(relatedGames.length / DLCS_PER_PAGE) || 1
  const pagedDlcs = relatedGames.slice(
    (page - 1) * DLCS_PER_PAGE,
    page * DLCS_PER_PAGE
  )

  return (
    <>
      {game.parentGame && (
        <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
          <SectionHeading icon={Crown}>Jogo Original</SectionHeading>
          <Link
            to={`/games/${game.parentGame.igdbId}`}
            className="flex items-center gap-4 p-3 bg-dark-bg-lighter border border-dark-border rounded-lg hover:border-primary/50 transition-colors group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
          >
            {game.parentGame.coverUrl ? (
              <img
                src={game.parentGame.coverUrl}
                alt={game.parentGame.name}
                className="w-12 h-16 object-cover rounded flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-16 rounded bg-dark-bg flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate group-hover:text-primary-light transition-colors">
                {game.parentGame.name}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">Jogo base</p>
            </div>
          </Link>
        </div>
      )}

      {relatedGames.length > 0 && (
        <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
          <SectionHeading icon={Plus}>DLCs Disponíveis</SectionHeading>
          <div className="flex flex-col gap-2">
            {pagedDlcs.map(dlc => (
              <Link
                to={`/games/${dlc.igdbId}`}
                key={dlc.igdbId}
                className="flex items-center gap-4 p-3 bg-dark-bg-lighter border border-dark-border rounded-lg hover:border-primary/50 transition-colors group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              >
                {dlc.coverUrl ? (
                  <img
                    src={dlc.coverUrl}
                    alt={dlc.name}
                    className="w-12 h-16 object-cover rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-16 rounded bg-dark-bg flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate group-hover:text-primary-light transition-colors">
                    {dlc.name}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {getGameTag(
                      dlc.name,
                      dlc.summary,
                      dlc.category,
                      dlc.parentGameId
                    ) ?? 'Edição'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {relatedGames.length > DLCS_PER_PAGE && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={relatedGames.length}
              itemsPerPage={pagedDlcs.length}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </>
  )
}
