import { useState } from 'react'

import { GameModal } from '../gamesComponents/gameModal'

import type { UserGame, UserGames } from '../../types/user'
import { UserGameInfo } from './userGameInfo'

export function UserGameCard({ userGames }: UserGames) {
  const [currentGame, setCurrentGame] = useState<UserGame | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      {userGames.map(userGame => (
        <div key={userGame.game.id}>
          <button
            type="button"
            onClick={() => {
              setCurrentGame(userGame)
              setOpen(true)
            }}
          >
            <img
              className="w-[230px] h-[320px]"
              src={userGame.game.gameBanner}
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
          <UserGameInfo
            userGame={currentGame}
            afterSave={() => {
              setOpen(false)
            }}
          />
        </GameModal>
      </div>
    </>
  )
}
