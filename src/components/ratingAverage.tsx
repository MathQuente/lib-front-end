import { Rating, Skeleton, Stack, Typography } from '@mui/material'
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

  if (isLoading) return <Skeleton variant="rounded" width={200} height={40} />
  if (isError) return <div>Erro ao carregar avaliação</div>

  const handleRatingChange = async (
    _: SyntheticEvent,
    newValue: number | null
  ) => {
    const valueToUse = newValue === null ? hoverValue : newValue

    if (valueToUse !== null) {
      await addRating(valueToUse)
    }
  }

  async function handleDelete() {
    await removeRating()
  }

  const getAverageRatingDisplay = () => {
    if (isAverageLoading) return 'Carregando...'
    if (isAverageError) return 'Erro ao carregar'
    if (!average || average.average === undefined || average.average === null) {
      return 'Sem avaliações'
    }
    return Math.floor(average.average * 10) / 10
  }

  if (justAverage) {
    return (
      <p className="text-xl font-bold text-white">
        {getAverageRatingDisplay()}
      </p>
    )
  }

  const dateRelease = game?.gameLaunchers?.[0]?.dateRelease
  const gameIsReleased = dateRelease
    ? new Date() > new Date(dateRelease)
    : false

  if (!gameIsReleased) {
    return (
      <>
        <p className="text-lg font-semibold text-white">
          This game hasn't been released yet
        </p>
        <div className="flex flex-col">
          <Typography>
            Sua avaliação: {userRating !== null ? userRating : 0}
          </Typography>
          <Typography>Avaliação geral: {getAverageRatingDisplay()}</Typography>
        </div>
      </>
    )
  }

  if (isForGamePage) {
    return (
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{ position: 'relative' }}
      >
        {userRating && (
          <button
            type="button"
            aria-label="Delete rating"
            onClick={handleDelete}
            disabled={!userRating || isMutating}
            className="absolute -left-3 text-gray-400 hover:text-white text-sm translate-x-1"
            style={{}}
          >
            <X />
          </button>
        )}

        <div className="relative">
          <Rating
            name="fixed-rating"
            value={userRating}
            readOnly
            precision={0.5}
            size="large"
            sx={{
              position: 'absolute',
              zIndex: 1,
              '& .MuiRating-icon': {
                color: '#783FCF'
              }
            }}
          />

          <Rating
            name="hover-rating"
            value={hoverValue || userRating}
            onChange={handleRatingChange}
            onChangeActive={(_, newHover) => setHoverValue(newHover)}
            onMouseLeave={() => setHoverValue(null)}
            disabled={isMutating}
            precision={0.5}
            size="large"
            sx={{
              position: 'relative',
              zIndex: 2,
              '& .MuiRating-icon': {
                color: '#9d7dd1',
                opacity: 0.7
              }
            }}
          />
        </div>
      </Stack>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{ position: 'relative' }}
      >
        {userRating && (
          <button
            type="button"
            aria-label="Delete rating"
            onClick={handleDelete}
            disabled={!userRating || isMutating}
            className="absolute -left-3 text-gray-400 hover:text-white text-sm translate-x-1"
            style={{}}
          >
            <X />
          </button>
        )}

        <div className="relative">
          <Rating
            name="fixed-rating"
            value={userRating}
            readOnly
            precision={0.5}
            size="large"
            sx={{
              position: 'absolute',
              zIndex: 1,
              '& .MuiRating-icon': {
                color: '#783FCF'
              }
            }}
          />

          <Rating
            name="hover-rating"
            value={hoverValue || userRating}
            onChange={handleRatingChange}
            onChangeActive={(_, newHover) => setHoverValue(newHover)}
            onMouseLeave={() => setHoverValue(null)}
            disabled={isMutating}
            precision={0.5}
            size="large"
            sx={{
              position: 'relative',
              zIndex: 2,
              '& .MuiRating-icon': {
                color: '#9d7dd1',
                opacity: 0.7
              }
            }}
          />
        </div>
      </Stack>
      <div className="flex flex-col">
        <Typography>
          Sua avaliação: {userRating !== null ? userRating : 0}
        </Typography>
        <Typography>Avaliação geral: {getAverageRatingDisplay()}</Typography>
      </div>
    </div>
  )
}
