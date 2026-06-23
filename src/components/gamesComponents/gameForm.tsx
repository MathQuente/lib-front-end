import { Gamepad2, Library, Gift, Play } from 'lucide-react'
import { PlayedCount } from '../playedCount'
import { useGameStatus } from '../../hooks/useGameStatus'
import { useAddGame } from '../../hooks/useAddGame'
import type { GameFormProps } from '../../interfaces/games'

const STATUS = {
  PLAYED: 1,
  PLAYING: 2,
  BACKLOG: 4,
  WISHLIST: 5
} as const

export function GameForm({ game }: GameFormProps) {
  const igdbId = game?.igdbId?.toString()
  const { gameStatus, updateGameStatus } = useGameStatus(igdbId)
  const { addGame, removeGame } = useAddGame(igdbId)

  if (!game) return null

  const activeStatus = gameStatus?.userGameStatus
  const hasStatus = (statusId: number) => activeStatus?.id === statusId

  async function handleStatusClick(statusId: number) {
    const isAlreadyActive = hasStatus(statusId)
    const hasExistingStatus = activeStatus != null

    if (isAlreadyActive) {
      await removeGame()
    } else if (hasExistingStatus) {
      await updateGameStatus({ statusIds: statusId })
    } else {
      await addGame({ statusIds: statusId })
    }
  }

  const gameIsReleased = game.releaseDate
    ? new Date() > new Date(game.releaseDate * 1000)
    : true

  const buttons = [
    ...(gameIsReleased
      ? [
          { statusId: STATUS.PLAYED, icon: Gamepad2, label: 'Jogado' },
          { statusId: STATUS.PLAYING, icon: Play, label: 'Jogando' },
          { statusId: STATUS.BACKLOG, icon: Library, label: 'Backlog' }
        ]
      : []),
    { statusId: STATUS.WISHLIST, icon: Gift, label: 'Lista de Desejos' }
  ]

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-center gap-4">
        {buttons.map(({ statusId, icon: Icon, label }) => {
          const active = hasStatus(statusId)
          return (
            <button
              key={statusId}
              type="button"
              onClick={() => handleStatusClick(statusId)}
              className={`flex flex-col items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all group ${
                active
                  ? 'bg-primary/10 ring-1 ring-primary/30'
                  : 'hover:bg-dark-bg-lighter'
              }`}
            >
              <Icon
                className={`size-6 transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-gray-600 group-hover:text-gray-400'
                }`}
              />
              <span
                className={`text-xs transition-colors ${
                  active
                    ? 'text-primary font-medium'
                    : 'text-gray-500 group-hover:text-gray-300'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {hasStatus(STATUS.PLAYED) && <PlayedCount game={game} />}
    </div>
  )
}
