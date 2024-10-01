import { useState } from 'react'

import { GameModal } from './gamesComponents/gameModal'
import { GameInfo } from './gamesComponents/gameInfo'

import type { Game, Games } from '../types/games'

export function GameCard({ games }: Games) {
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
            <img className="w-[230px] h-[320px]" src={game.gameBanner} alt="" />
          </button>
        </div>
      ))}
      <div>
        <GameModal
          open={open}
          onOpenChange={open => {
            setOpen(open)
          }}
        >
          <GameInfo
            game={currentGame}
            afterSave={() => {
              setOpen(false)
            }}
          />
        </GameModal>
      </div>
    </>
  )
}
