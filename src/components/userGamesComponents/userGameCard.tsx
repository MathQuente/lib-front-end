import { useState } from 'react'

import type { UserGameDlcBase } from '../../types/user'
import { UserGameInfo } from './userGameInfo'
import { UserGameModal } from './userGameModal'

interface GameCardProps {
  userGamesAndDlcs: UserGameDlcBase[]
}

export function UserGameCard({ userGamesAndDlcs }: GameCardProps) {
  const [currentGame, setCurrentGame] = useState<UserGameDlcBase | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      {userGamesAndDlcs.map(item => (
        <div key={item.id}>
          <button
            type="button"
            onClick={() => {
              setCurrentGame(item)
              setOpen(true)
            }}
          >
            <img
              className="w-32 h-36 sm:w-36 md:w-36 lg:w-40 sm:h-40 lg:h-48 xl:w-40 xl:min-h-52 2xl:w-48 2xl:min-h-64 rounded-lg"
              src={item.banner}
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
            onClose={() => {
              setOpen(true)
            }}
          />
        </UserGameModal>
      </div>
    </>
  )
}
