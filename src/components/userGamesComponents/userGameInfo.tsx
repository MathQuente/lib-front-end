import { Rating, Skeleton, Stack, Typography } from '@mui/material'
import type { UserGame } from '../../types/user'

import { Link } from 'react-router-dom'
import { UserGameModal } from './userGameModal'
import { UserGameForm } from './userGameForm'
import { useRating } from '../../hooks/useRating'
import type { SyntheticEvent } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function UserGameInfo({
  onClose,
  userGame,
}: {
  onClose: () => void
  userGame: UserGame
}) {
  const { rating, isLoading, isError, addRating, removeRating, isMutating } =
    useRating(userGame.id)

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

  return (
    <div key={userGame.id} className="flex flex-col p-4">
      <div className="flex flex-col md:flex-row md:justify-around py-4">
        {/* Game Image */}
        <div className="flex items-center">
          <img
            className="rounded-md w-[285px] h-[380px]"
            src={userGame.gameBanner}
            alt=""
          />
        </div>

        {/* Game Info */}
        <div className="flex flex-col justify-around items-center">
          <div className="flex flex-wrap flex-col items-center">
            <h1 className="text-base md:text-xl font-bold">
              {userGame.gameName}
            </h1>
          </div>

          {user && <UserGameForm onClose={onClose} userGame={userGame} />}

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
            <Typography>
              Avaliação: {rating !== null ? rating : 'Nenhuma'}
            </Typography>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-4 border-t border-gray-700">
        <Link to={`/games/${userGame.id}`}>
          <button
            type="button"
            className="ml-4 px-4 py-2 bg-gradient-to-t from-[#4D23A5] to-[#783FCF] hover:from-[#5D23A5] hover:to-[#813FCF] text-white rounded"
          >
            View Details
          </button>
        </Link>
        <UserGameModal.Close
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600  text-sm font-medium text-gray-500 hover:text-white"
        >
          Cancel
        </UserGameModal.Close>
      </div>
    </div>
  )
}
