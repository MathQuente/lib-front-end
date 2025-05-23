import type { GameDlcBase } from '../../types/games'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'

import { GameModal } from './gameModal'
import { GameForm } from './gameForm'
import { Link } from 'react-router-dom'

export function GameInfo({
  gameAndDlc,
  onClose,
}: {
  gameAndDlc: GameDlcBase | null
  onClose: () => void
}) {
  if (!gameAndDlc) {
    return null
  }

  return (
    <div key={gameAndDlc.id} className="flex flex-col p-4">
      <div className="flex flex-col md:flex-row md:justify-around py-4">
        {/* Game Image */}
        <div className="flex items-center">
          <img
            className="rounded-md w-[285px] h-[380px]"
            src={gameAndDlc.banner}
            alt=""
          />
        </div>

        {/* Game Info */}
        <div className="flex flex-col justify-around items-center">
          <div className="flex flex-wrap flex-col items-center">
            <h1 className="text-base md:text-xl font-bold">
              {gameAndDlc.name}
            </h1>
          </div>

          <GameForm item={gameAndDlc} />

          <div>
            <Stack spacing={4}>
              <Rating
                name="half-rating"
                defaultValue={0}
                precision={0.5}
                size="large"
              />
            </Stack>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-4 border-t border-gray-700">
        <Link to={`/games/${gameAndDlc.id}`}>
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
