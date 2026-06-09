import { IoGameController, IoLibrary } from 'react-icons/io5'
import { FaGift, FaPlay } from 'react-icons/fa'
import { PlayedCount } from '../playedCount'
import { useGameStatus } from '../../hooks/useGameStatus'
import { useAddGame } from '../../hooks/useAddGame'
import type { GameBase } from '../../types/games'

const STATUS = {
  PLAYED: 1,
  PLAYING: 2,
  REPLAYING: 3,
  BACKLOG: 4,
  WISHLIST: 5
} as const

export function GameForm({ game }: { game: GameBase | undefined }) {
  const { gameStatus, updateGameStatus } = useGameStatus(game?.id)
  const { addGame, removeGame } = useAddGame(game?.id)

  if (!game) return null

  const currentStatuses = gameStatus?.userGameStatus

  const hasStatus = (statusId: number) => currentStatuses?.id === statusId

  async function handleAddGame(statusId: number) {
    const isTarget = hasStatus(statusId)
    const hasAny = currentStatuses != null

    if (isTarget) {
      await removeGame()
    } else if (hasAny) {
      await updateGameStatus({ statusIds: statusId })
    } else {
      await addGame({ statusIds: statusId })
    }
  }

  const dateRelease = game.gameLaunchers?.[0]?.dateRelease
  const gameIsReleased = dateRelease ? new Date() > new Date(dateRelease) : true

  const buttons = [
    ...(gameIsReleased
      ? [
          { statusId: STATUS.PLAYED, icon: IoGameController, label: 'Played' },
          { statusId: STATUS.PLAYING, icon: FaPlay, label: 'Playing' },
          { statusId: STATUS.BACKLOG, icon: IoLibrary, label: 'Backlog' }
        ]
      : []),
    { statusId: STATUS.WISHLIST, icon: FaGift, label: 'Wishlist' }
  ]

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-center gap-4">
        {buttons.map(({ statusId, icon: Icon, label }) => (
          <button
            key={statusId}
            type="button"
            onClick={() => handleAddGame(statusId)}
            className="flex flex-col items-center gap-1 group"
          >
            <Icon
              className={`size-7 transition-colors ${
                hasStatus(statusId)
                  ? 'text-[#7A38CA]'
                  : 'text-gray-600 group-hover:text-gray-400'
              }`}
            />
            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
              {label}
            </span>
          </button>
        ))}
      </div>

      {hasStatus(STATUS.PLAYED) && <PlayedCount game={game} />}
    </div>
  )
}
