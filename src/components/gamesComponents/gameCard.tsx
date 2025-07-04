import { useState } from 'react'

import { GameModal } from './gameModal'
import { GameInfo } from './gameInfo'

import type { Game } from '../../types/games'

interface GameCardProps {
  games: Game[]
}

export function GameCard({ games }: GameCardProps) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      {games.map(game => (
        <div key={game.id}>
          <button
            type="button"
            onClick={() => {
              setCurrentGame(game)
              setOpen(true)
            }}
          >
            <img
              className="w-32 h-16 sm:w-36 md:w-44 md:h-56 sm:h-40 lg:min-w-28 lg:h-44 xl:w-48 xl:h-52 2xl:w-48 2xl:min-h-64 rounded-lg"
              src={game.gameBanner}
              alt={game.gameName}
            />
          </button>
        </div>
      ))}

      {currentGame && (
        <div>
          <GameModal
            open={open}
            onOpenChange={open => {
              setOpen(open)
            }}
          >
            <GameInfo
              game={currentGame}
              onClose={() => {
                setOpen(false)
              }}
            />
          </GameModal>
        </div>
      )}
    </>
  )
}
