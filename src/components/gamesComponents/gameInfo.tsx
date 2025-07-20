import type { Game } from '../../types/games'

import { GameModal } from './gameModal'
import { GameForm } from './gameForm'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { RatingAverage } from '../ratingAverage'

interface GameInfoProps {
  game: Game
  onClose: () => void
}

export function GameInfo({ game, onClose }: GameInfoProps) {
  const { user } = useAuth()

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

          {user && <RatingAverage gameId={game.id} />}

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
