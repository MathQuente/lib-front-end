import { PlayedCount } from '../playedCount'
import { FaGift, FaPlay } from 'react-icons/fa'
import { IoGameController, IoLibrary } from 'react-icons/io5'
import { useGameStatus } from '../../hooks/useGameStatus'
import { useAddGame } from '../../hooks/useAddGame'
import type { Game } from '../../types/games'

export function UserGameForm({
  userGame,
  onClose
}: {
  userGame: Game
  onClose: () => void
}) {
  const { gameStatus, updateUserGameStatus } = useGameStatus(userGame.id)
  const { removeUserGame } = useAddGame(userGame.id)

  const currentStatuses = gameStatus?.userGameStatuses

  if (!userGame) {
    return null
  }

  const STATUS = {
    PLAYED: 1,
    PLAYING: 2,
    REPLAYING: 3,
    BACKLOG: 4,
    WISHLIST: 5
  }

  const hasStatus = (statusId: number) => {
    return currentStatuses?.id === statusId
  }

  const isPlayed = hasStatus(STATUS.PLAYED)
  const isPlaying = hasStatus(STATUS.PLAYING)

  async function handleAddGame(statusId: number) {
    const isTarget = hasStatus(statusId)
    const hasAny = currentStatuses !== null && currentStatuses !== undefined

    if (isTarget) {
      // toggle off - remove o jogo
      await removeUserGame()
    } else if (hasAny) {
      // já existe outro status: substitui
      await updateUserGameStatus({
        statusIds: statusId
      })
    } else {
      // não existe nenhum: adiciona (caso não deveria acontecer no UserGameForm)
      console.warn('UserGame sem status - isso não deveria acontecer')
    }

    // Chamar onClose() em todos os casos
    onClose()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          className="flex flex-col items-center"
          type="button"
          onClick={() => handleAddGame(STATUS.PLAYED)}
        >
          <IoGameController
            className={`size-8 ${
              isPlayed ? 'text-green-600' : 'text-gray-600'
            }`}
          />
          <p className="text-gray-400 hover:text-gray-100">Played</p>
        </button>

        <button
          className="flex flex-col items-center"
          type="button"
          onClick={() => handleAddGame(STATUS.PLAYING)}
        >
          <FaPlay
            className={`size-8 ${
              isPlaying ? 'text-green-600' : 'text-gray-600'
            }`}
          />
          <p className="text-gray-400 hover:text-gray-100">Playing</p>
        </button>

        <button
          className="flex flex-col items-center"
          type="button"
          onClick={() => handleAddGame(STATUS.BACKLOG)}
        >
          <IoLibrary
            className={`size-8 ${
              hasStatus(STATUS.BACKLOG) ? 'text-green-600' : 'text-gray-600'
            }`}
          />
          <p className="text-gray-400 hover:text-gray-100">Backlog</p>
        </button>
        <button
          className="flex flex-col items-center"
          type="button"
          onClick={() => handleAddGame(STATUS.WISHLIST)}
        >
          <FaGift
            className={`size-8 ${
              hasStatus(STATUS.WISHLIST) ? 'text-green-600' : 'text-gray-600'
            }`}
          />
          <p className="text-gray-400 hover:text-gray-100">Wishlist</p>
        </button>
      </div>
      <PlayedCount game={userGame} isPlayed={isPlayed} />
    </div>
  )
}
