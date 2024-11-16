import { useState } from 'react'

import { GameModal } from './gameModal'
import { GameInfo } from './gameInfo'

import type { GameAndDLC } from '../../types/games'

interface GameCardProps {
  gamesAndDlcs: GameAndDLC[]
}

export function GameCard({ gamesAndDlcs }: GameCardProps) {
  const [currentGame, setCurrentGame] = useState<GameAndDLC | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      {gamesAndDlcs.map(item => (
        <div key={item.game?.id || item.dlc?.id}>
          <button
            type="button"
            onClick={() => {
              setCurrentGame(item)
              setOpen(true)
            }}
          >
            {item.dlc?.dlcBanner && (
              <div className="absolute ml-2 mt-1 w-10 h-7 flex items-center justify-center bg-zinc-800 rounded-xl">
                <p className="font-normal text-gray-300 text-xs">DLC</p>
              </div>
            )}
            <img
              className="w-[230px] h-[320px] rounded-lg"
              src={item.game?.gameBanner || item.dlc?.dlcBanner}
              alt=""
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
