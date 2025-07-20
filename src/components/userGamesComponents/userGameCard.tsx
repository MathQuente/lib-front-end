import { useState } from 'react'

import type { UserGame } from '../../types/user'
import { UserGameInfo } from './userGameInfo'
import { UserGameModal } from './userGameModal'

interface UserGameCardProps {
  userGame: UserGame

  enableModal?: boolean
}

export function UserGameCard({
  userGame,

  enableModal = true
}: UserGameCardProps) {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    if (enableModal) setOpen(true)
  }

  return (
    <>
      <div>
        <button
          type="button"
          onClick={handleClick}
          className="transition-transform hover:scale-105 hover:ring-2 hover:ring-purple-500 rounded-lg"
        >
          <img
            className="w-32 h-36 sm:w-36 md:w-36 lg:w-40 sm:h-40 lg:h-48 xl:w-40 xl:min-h-52 2xl:w-48 2xl:h-64 rounded-lg"
            src={userGame.gameBanner}
            alt=""
          />
        </button>
      </div>

      {enableModal && (
        <UserGameModal open={open} onOpenChange={setOpen}>
          <UserGameInfo userGame={userGame} onClose={() => setOpen(false)} />
        </UserGameModal>
      )}
    </>
  )
}
