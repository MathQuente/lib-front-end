import { Rating } from '@mui/material'
import { useRating } from '../hooks/useRating'
import { useState, type SyntheticEvent } from 'react'
import { Star, X } from 'lucide-react'
import type { RatingAverageProps } from '../interfaces/games'

export function RatingAverage({
  game,
  isForGamePage,
  justAverage
}: RatingAverageProps) {
  const igdbId = game?.igdbId?.toString()

  const {
    userRating,
    average,
    isAverageError,
    isAverageLoading,
    isLoading,
    isError,
    addRating,
    removeRating,
    isMutating
  } = useRating(igdbId)

  const [hoverValue, setHoverValue] = useState<number | null>(null)

  if (isLoading)
    return (
      <div className="h-8 w-40 rounded-lg bg-dark-bg-lighter animate-pulse" />
    )
  if (isError) return null

  const averageDisplay = (() => {
    if (isAverageLoading) return '—'
    if (isAverageError || !average || average.average == null)
      return 'Sem avaliações'
    return Math.floor(average.average * 10) / 10
  })()

  if (justAverage) {
    return (
      <div className="flex items-center gap-1.5">
        <Star className="size-4 text-primary fill-primary" />
        <p className="text-xl font-bold text-white">{averageDisplay}</p>
      </div>
    )
  }

  const gameIsReleased = game?.releaseDate
    ? new Date() > new Date(game.releaseDate * 1000)
    : false

  if (!gameIsReleased) {
    return (
      <p className="text-sm text-gray-500">Este jogo ainda não foi lançado.</p>
    )
  }

  const handleRatingChange = async (
    _: SyntheticEvent,
    newValue: number | null
  ) => {
    const value = newValue ?? hoverValue
    if (value !== null) await addRating(value)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="relative inline-flex">
          <Rating
            name="fixed-rating"
            value={userRating}
            readOnly
            precision={0.5}
            size="large"
            sx={{
              position: 'absolute',
              zIndex: 1,
              '& .MuiRating-icon': { color: '#7A38CA' }
            }}
          />
          <Rating
            name="hover-rating"
            value={hoverValue ?? userRating}
            onChange={handleRatingChange}
            onChangeActive={(_, v) => setHoverValue(v)}
            onMouseLeave={() => setHoverValue(null)}
            disabled={isMutating}
            precision={0.5}
            size="large"
            sx={{
              position: 'relative',
              zIndex: 2,
              '& .MuiRating-icon': { color: '#9D52E8', opacity: 0.7 }
            }}
          />
        </div>
        {userRating && (
          <button
            type="button"
            aria-label="Remover avaliação"
            onClick={removeRating}
            disabled={isMutating}
            className="text-gray-600 hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X size={15} />
          </button>
        )}
      </div>
      {!isForGamePage && (
        <p className="text-xs">
          <span className="text-gray-500">Sua nota: </span>
          <span className="text-gray-300 font-medium">{userRating ?? '—'}</span>
          <span className="mx-1.5 text-gray-600">·</span>
          <span className="text-gray-500">Média: </span>
          <span className="text-gray-300 font-medium">{averageDisplay}</span>
        </p>
      )}
    </div>
  )
}
