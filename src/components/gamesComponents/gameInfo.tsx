import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Pencil, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { USER_GAME_STATUS_ID as STATUS } from '../../constants/gameStatus'
import { api } from '../../hooks/useApi'
import { useAuth } from '../../hooks/useAuth'
import { useGameStatus } from '../../hooks/useGameStatus'
import { useRating } from '../../hooks/useRating'
import type { GameInfoProps } from '../../interfaces/games'
import type { GameResponse } from '../../types/games'
import { hiResCover } from '../../utils/hiResCover'
import { Button } from '../button'
import { CategoriesDiv } from '../categoriesDiv'
import { RatingAverage } from '../ratingAverage'
import { GameModal } from './gameModal'
import { GameStatusButtons } from './gameStatusButtons'
import { LibraryStats } from './libraryStats'

export function GameInfo({ game, onClose }: GameInfoProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const igdbId = game?.igdbId?.toString()
  const gamePath = `/games/${igdbId}`

  const { data: details, isLoading: isDetailsLoading } = useQuery<GameResponse>(
    {
      queryKey: ['game', igdbId],
      queryFn: () => api.getGame(igdbId),
      enabled: Boolean(igdbId),
    }
  )
  const { gameStatus } = useGameStatus(user ? igdbId : undefined)
  const { average } = useRating(igdbId)
  const hasCommunityAverage = average?.average != null

  if (!game || !igdbId) return null

  const statusId = gameStatus?.userGameStatus?.id
  const inLibrary = Boolean(user && statusId && statusId !== STATUS.WISHLIST)
  const inWishlist = statusId === STATUS.WISHLIST

  const releaseDate = details?.game.releaseDate ?? game.releaseDate ?? null
  const releaseYear = releaseDate ? dayjs.unix(releaseDate).year() : null
  const isUpcoming = releaseDate
    ? dayjs.unix(releaseDate).isAfter(dayjs())
    : false
  const genres = details?.game.genres.slice(0, 3) ?? []
  const summary = details?.game.summary ?? game.summary

  function goToDetails() {
    onClose()
    navigate(gamePath)
  }

  const summaryBlock = summary ? (
    <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">
      {summary}
    </p>
  ) : null

  return (
    <div key={igdbId} className="relative flex flex-col md:flex-row gap-6 p-5">
      <GameModal.Close
        aria-label="Fechar"
        className="absolute top-2 right-2 size-11 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-dark-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
      >
        <X className="size-5" aria-hidden />
      </GameModal.Close>

      {game.coverUrl ? (
        <img
          className="w-44 md:w-[300px] aspect-[3/4] shrink-0 self-center md:self-start rounded-md object-cover"
          src={hiResCover(game.coverUrl)}
          alt={`Capa do jogo ${game.name}`}
        />
      ) : (
        <div className="w-44 md:w-[300px] aspect-[3/4] shrink-0 self-center md:self-start rounded-md bg-dark-bg flex items-center justify-center">
          <span className="text-gray-400 text-sm">Sem capa</span>
        </div>
      )}

      <div className="flex flex-col w-full md:w-[400px] md:shrink-0 gap-5">
        <div className="flex flex-col gap-2 pr-10">
          <GameModal.Title asChild>
            <h2 className="text-xl font-bold leading-snug line-clamp-2">
              {game.name}
            </h2>
          </GameModal.Title>
          {inLibrary ? null : isDetailsLoading ? (
            <div className="h-7 w-48 rounded-full bg-dark-bg animate-pulse" />
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {releaseYear && (
                <span className="text-sm text-gray-400 mr-1">
                  {releaseYear}
                </span>
              )}
              {genres.map(genre => (
                <CategoriesDiv key={genre} categoryName={genre} />
              ))}
            </div>
          )}
        </div>

        {inLibrary ? (
          <>
            <GameStatusButtons game={game} />
            <LibraryStats
              game={game}
              isPlayed={statusId === STATUS.PLAYED}
              statusId={statusId}
            />
          </>
        ) : (
          <>
            {inWishlist && isUpcoming && releaseDate && (
              <p className="text-sm text-primary-light">
                Lança em {dayjs.unix(releaseDate).format('DD/MM/YYYY')}
              </p>
            )}
            {!inWishlist && hasCommunityAverage && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RatingAverage game={game} justAverage />
                média da comunidade
              </div>
            )}
            {summaryBlock}
            {user ? (
              <div className="flex flex-col gap-2">
                {!inWishlist && (
                  <span className="text-sm text-gray-300">
                    Adicione à sua biblioteca
                  </span>
                )}
                <GameStatusButtons game={game} />
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                <Link to="/auth" className="text-primary-light hover:underline">
                  Entrar
                </Link>{' '}
                para adicionar à sua biblioteca.
              </p>
            )}
          </>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          {inLibrary && (
            <p className="text-xs leading-snug text-gray-400">
              Edite horas, plataformas e datas na página do jogo.
            </p>
          )}
          <Button
            type="button"
            variant="primary"
            size="sm"
            className={`shrink-0 gap-1.5 ${inLibrary ? '' : 'ml-auto'}`}
            onClick={goToDetails}
          >
            {inLibrary ? (
              <>
                <Pencil className="size-3.5" aria-hidden />
                Editar registro
              </>
            ) : (
              'Ver detalhes'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
