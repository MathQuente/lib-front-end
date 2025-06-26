import type { Game } from '../../types/games'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'

import { GameModal } from './gameModal'
import { GameForm } from './gameForm'
import { Link } from 'react-router-dom'
import type { SyntheticEvent } from 'react'
import { Skeleton, Typography } from '@mui/material'
import { useRating } from '../../hooks/useRating'
import { X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { useApi } from '../../hooks/useApi'

interface GameInfoProps {
  game: Game
  onClose: () => void
}

export function GameInfo({ game, onClose }: GameInfoProps) {
  const api = useApi()
  const { rating, isLoading, isError, addRating, removeRating, isMutating } =
    useRating(game.id)

  const {
    data: average,
    isLoading: isAverageLoading,
    isError: isAverageError,
  } = useQuery({
    queryFn: () => api.getAverageRating(game.id),
    queryKey: [game.id, rating, 'averageRating'],
    enabled: Boolean(game.id),
    staleTime: 1000 * 60 * 5,
  })

  const { user } = useAuth()

  if (isLoading) return <Skeleton variant="rounded" width={200} height={40} />
  if (isError) return <div>Erro ao carregar avaliação</div>

  const handleRatingChange = async (
    _: SyntheticEvent,
    newValue: number | null
  ) => {
    if (newValue === null) return
    await addRating(newValue)
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
    return average.average.toFixed(1) // Display with 1 decimal place
  }

  return (
    <div key={game.id} className="flex flex-col p-4">
      <div className="flex flex-col md:flex-row md:justify-around py-4">
        {/* Game Image */}
        <div className="flex items-center">
          <img
            className="rounded-md w-[285px] h-[380px]"
            src={game.gameBanner}
            alt={`Capa do jogo ${game.gameName}`}
          />
        </div>

        {/* Game Info */}
        <div className="flex flex-col justify-around items-center">
          <div className="flex flex-wrap flex-col items-center">
            <h1 className="text-base md:text-xl font-bold">{game.gameName}</h1>
          </div>

          {user && <GameForm game={game} />}

          {user && (
            <div>
              <Stack
                spacing={2}
                direction="row"
                alignItems="center"
                sx={{ position: 'relative' }}
              >
                {rating && (
                  <button
                    type="button"
                    aria-label="Delete rating"
                    onClick={handleDelete}
                    disabled={!rating || isMutating}
                    className="absolute -left-3 text-gray-400 hover:text-white text-sm translate-x-1"
                    style={{}}
                  >
                    <X />
                  </button>
                )}

                <Rating
                  name="half-rating"
                  value={rating}
                  onChange={handleRatingChange}
                  disabled={isMutating}
                  precision={0.5}
                  size="large"
                />
              </Stack>
              <div className="flex flex-col">
                <Typography>
                  Sua avaliação: {rating !== null ? rating : 'Nenhuma'}
                </Typography>
                <Typography>
                  Avaliação geral: {getAverageRatingDisplay()}
                </Typography>
              </div>
            </div>
          )}

          {!user && (
            <div className="flex gap-1">
              <Link to="/auth" className="text-[#8C67F6]">
                Log in
              </Link>
              <p>to access rating features.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-4 border-t border-gray-700">
        <Link to={`/games/${game.id}`}>
          <button
            type="button"
            className="ml-4 px-4 py-2 bg-gradient-to-t from-[#4D23A5] to-[#783FCF] hover:from-[#5D23A5] hover:to-[#813FCF] text-white rounded"
          >
            View Details
          </button>
        </Link>
        <GameModal.Close
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600  text-sm font-medium text-gray-500 hover:text-white"
        >
          Cancel
        </GameModal.Close>
      </div>
    </div>
  )
}
