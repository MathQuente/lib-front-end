import { Rating, Skeleton, Stack, Typography } from '@mui/material'
import { useRating } from '../hooks/useRating'
import { useState, type SyntheticEvent } from 'react'
import { X } from 'lucide-react'

interface RatingAverageProps {
  gameId: string | undefined
  isForGamePage?: boolean
  justAverage?: boolean
}

export function RatingAverage({
  gameId,
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
  } = useRating(gameId)

  const [hoverValue, setHoverValue] = useState<number | null>(null)

  if (isLoading) return <Skeleton variant="rounded" width={200} height={40} />
  if (isError) return <div>Erro ao carregar avaliação</div>

  const handleRatingChange = async (
    _: SyntheticEvent,
    newValue: number | null
  ) => {
    // Se newValue é null, usa o hoverValue; senão usa newValue
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

        {/* Container para as duas avaliações */}
        <div className="relative">
          {/* Rating fixo (valor já avaliado) */}
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

          {/* Rating interativo (hover) */}
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
                opacity: 0.7 // Permite ver parcialmente o rating fixo atrás
              }
            }}
          />
        </div>
      </Stack>
    )
  }

  if (justAverage) {
    return (
      <p className="text-xl font-bold text-white">
        {getAverageRatingDisplay()}
      </p>
    )
  }

  return (
    <div>
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
          {/* Rating fixo (valor já avaliado) */}
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

          {/* Rating interativo (hover) */}
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
                opacity: 0.7 // Permite ver parcialmente o rating fixo atrás
              }
            }}
          />
        </div>
      </Stack>
      <div className="flex flex-col">
        <Typography>
          Sua avaliação: {userRating !== null ? userRating : 'Nenhuma'}
        </Typography>
        <Typography>Avaliação geral: {getAverageRatingDisplay()}</Typography>
      </div>
    </div>
  )
}
