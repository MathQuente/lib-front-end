import { GameForm } from './gameForm'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { RatingAverage } from '../ratingAverage'
import type { GameBase } from '../../types/games'
import { Button } from '../button'

interface GameInfoProps {
  game: GameBase | undefined
  onClose: () => void
}

export function GameInfo({ game, onClose }: GameInfoProps) {
  const { user } = useAuth()

  return (
    <div key={game?.id} className="flex flex-col p-4">
      <div className="flex flex-col items-center md:flex-row md:justify-around py-4">
        <div className="flex items-center">
          <img
            className="rounded-md w-[285px] h-[380px]"
            src={game?.gameBanner}
            alt={`Capa do jogo ${game?.gameName}`}
          />
        </div>

        <div className="flex flex-col justify-around items-center mt-2 gap-4">
          <div className="flex flex-wrap flex-col items-center">
            <h1 className="text-base md:text-xl font-bold">{game?.gameName}</h1>
          </div>

          {user && <GameForm game={game} />}

          {user && <RatingAverage game={game} />}

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

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
        <Link to={`/games/${game?.id}`}>
          <Button type="button" variant="primary" size="md">
            View Details
          </Button>
        </Link>
        <Button onClick={onClose} variant="cancel">
          Cancel
        </Button>
      </div>
    </div>
  )
}
