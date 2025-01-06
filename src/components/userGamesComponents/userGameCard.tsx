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
              className="min-w-28 h-36 sm:min-w-36 sm:h-40 md:min-w-12 lg:min-w-32 lg:h-40 xl:min-w-40 xl:min-h-52 2xl:min-w-48 2xl:min-h-64 rounded-lg"
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
            afterSave={() => {
              setOpen(false)
            }}
          />
        </UserGameModal>
      </div>
    </>
  )
}
