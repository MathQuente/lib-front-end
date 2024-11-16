import { useState } from 'react'

import type { UserGameAndDlc } from '../../types/user'
import { UserGameInfo } from './userGameInfo'
import { UserGameModal } from './userGameModal'

interface GameCardProps {
  userGamesAndDlcs: UserGameAndDlc[]
}

export function UserGameCard({ userGamesAndDlcs }: GameCardProps) {
  const [currentGame, setCurrentGame] = useState<UserGameAndDlc | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      {userGamesAndDlcs.map(item => (
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
        <UserGameModal
          open={open}
          onOpenChange={open => {
            setOpen(open)
          }}
        >
          <UserGameInfo
            userGame={currentGame}
            afterSave={() => {
              setOpen(false)
            }}
          />
        </UserGameModal>
      </div>
    </>
  )
}
