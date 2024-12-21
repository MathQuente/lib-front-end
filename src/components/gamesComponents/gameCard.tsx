import { useState } from 'react'

import { GameModal } from './gameModal'
import { GameInfo } from './gameInfo'

import type { GameDlcBase } from '../../types/games'

interface GameCardProps {
  games: GameDlcBase[]
}

export function GameCard({ games }: GameCardProps) {
  const [currentGame, setCurrentGame] = useState<GameDlcBase | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      {games.map(item => (
        <div key={item.id}>
          <button
            type="button"
            onClick={() => {
              setCurrentGame(item)
              setOpen(true)
            }}
          >
            {item.type === 'dlc' && (
              <div className="absolute ml-2 mt-1 w-10 h-7 flex items-center justify-center bg-zinc-800 rounded-xl">
                <p className="font-normal text-gray-300 text-xs">DLC</p>
              </div>
            )}
            <img
              className="w-[230px] h-[320px] rounded-lg"
              src={item.banner}
              alt={item.name}
            />
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
            gameAndDlc={currentGame}
            afterSave={() => {
              setOpen(false)
            }}
          />
        </GameModal>
      </div>
    </>
  )
}
