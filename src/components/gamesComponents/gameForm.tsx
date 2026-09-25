import { Gamepad2, Library, Gift, Play } from 'lucide-react'
import { PlayedCount } from '../playedCount'
import { HoursPlayed } from '../hoursPlayed'
import { CompletedAtInput } from '../completedAtInput'
import { useGameStatus } from '../../hooks/useGameStatus'
import { useAddGame } from '../../hooks/useAddGame'
import { USER_GAME_STATUS_ID as STATUS } from '../../constants/gameStatus'
import type { GameFormProps } from '../../interfaces/games'

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
          { statusId: STATUS.BACKLOG, icon: Library, label: 'Pendentes' }
        ]
      : []),
    { statusId: STATUS.WISHLIST, icon: Gift, label: 'Lista de desejos' }
  ]

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-wrap justify-center items-start gap-4">
        {buttons.map(({ statusId, icon: Icon, label }) => {
          const active = hasStatus(statusId)
          return (
            <button
              key={statusId}
              type="button"
              onClick={() => handleStatusClick(statusId)}
              className={`flex flex-col items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light group ${
                active
                  ? 'bg-primary/10 ring-1 ring-primary/30'
                  : 'hover:bg-dark-bg-lighter'
              }`}
            >
              <Icon
                className={`size-6 transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-gray-400 group-hover:text-gray-300'
                }`}
              />
              <span
                className={`text-xs transition-colors ${
                  active
                    ? 'text-primary font-medium'
                    : 'text-gray-400 group-hover:text-gray-300'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {hasStatus(STATUS.PLAYED) && <PlayedCount game={game} />}
      {hasStatus(STATUS.PLAYED) && <CompletedAtInput game={game} />}
      {activeStatus && activeStatus.id !== STATUS.WISHLIST && (
        <HoursPlayed game={game} />
      )}
    </div>
  )
}
