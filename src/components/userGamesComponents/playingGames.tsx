import { useState } from 'react'
import { Game, UserGame } from '../../types'
import UserGameModal from './userGameModal'
import { UserGamesForm } from './userGamesForm'

interface UserGameListProps {
  playingGames: UserGame[]
}

export function PlayingGames({ playingGames }: UserGameListProps) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="grid grid-cols-5 gap-7 bg-[#272932] p-12">
        {playingGames.map(({ game }) => (
          <div key={game.id}>
            <button
              onClick={() => {
                setCurrentGame(game)
                setOpen(true)
              }}
            >
              <img src={game.gameBanner} alt="" />
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
            <UserGamesForm
              game={currentGame}
              afterSave={() => {
                setOpen(false)
              }}
            />
          </UserGameModal>
        </div>
      </div>
    </>
  )
}
