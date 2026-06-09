import { Rating, Skeleton } from '@mui/material'
import { useRating } from '../hooks/useRating'
import { useState, type SyntheticEvent } from 'react'
import { X } from 'lucide-react'
import type { GameBase } from '../types/games'

interface RatingAverageProps {
  game: GameBase | undefined
  isForGamePage?: boolean
  justAverage?: boolean
}

export function RatingAverage({
  game,
  isForGamePage,
  justAverage
}: RatingAverageProps) {
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
  } = useRating(game?.id)

  const [hoverValue, setHoverValue] = useState<number | null>(null)

  if (isLoading) return <Skeleton variant="rounded" width={160} height={32} />
  if (isError) return null

  const averageDisplay = (() => {
    if (isAverageLoading) return '—'
    if (isAverageError || !average || average.average == null)
      return 'Sem avaliações'
    return Math.floor(average.average * 10) / 10
  })()

  if (justAverage) {
    return <p className="text-xl font-bold text-white">{averageDisplay}</p>
  }

  const dateRelease = game?.gameLaunchers?.[0]?.dateRelease
  const gameIsReleased = dateRelease
    ? new Date() > new Date(dateRelease)
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

  const ratingStars = (
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
          '& .MuiRating-icon': { color: '#783FCF' }
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
          '& .MuiRating-icon': { color: '#9d7dd1', opacity: 0.7 }
        }}
      />
    </div>
  )

  if (isForGamePage) {
    return (
      <div className="flex items-center gap-2">
        {ratingStars}
        {userRating && (
          <button
            type="button"
            aria-label="Remover avaliação"
            onClick={removeRating}
            disabled={isMutating}
            className="text-gray-600 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {ratingStars}
        {userRating && (
          <button
            type="button"
            aria-label="Remover avaliação"
            onClick={removeRating}
            disabled={isMutating}
            className="text-gray-600 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Sua avaliação: {userRating ?? 0} · Média: {averageDisplay}
      </p>
    </div>
  )
}
