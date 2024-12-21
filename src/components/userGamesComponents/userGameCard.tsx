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
              className="w-[230px] h-[320px] rounded-lg"
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
