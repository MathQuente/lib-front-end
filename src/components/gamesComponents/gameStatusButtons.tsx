import { Gamepad2, Gift, Library, Play } from 'lucide-react'
import { useState } from 'react'
import { USER_GAME_STATUS_ID as STATUS } from '../../constants/gameStatus'
import { useAddGame } from '../../hooks/useAddGame'
import { useGamePlatforms } from '../../hooks/useGamePlatforms'
import { useGameStatus } from '../../hooks/useGameStatus'
import type { GameFormProps } from '../../interfaces/games'
import type { UserGamePlatformEntry } from '../../types/platform'
import { getLibraryPlatform } from '../../utils/libraryPlatforms'
import { ConfirmDialog } from '../confirmDialog'

export function GameStatusButtons({ game }: GameFormProps) {
  const igdbId = game?.igdbId?.toString()
  const { gameStatus, updateGameStatus } = useGameStatus(igdbId)
  const { addGame, removeGame } = useAddGame(igdbId)

  const activeStatus = gameStatus?.userGameStatus
  const hasStatus = (statusId: number) => activeStatus?.id === statusId
  const canHavePlatforms = !!activeStatus && activeStatus.id !== STATUS.WISHLIST

  const { platforms, updatePlatform, isMutating } = useGamePlatforms(
    igdbId ?? '',
    canHavePlatforms
  )
  const [askingCompletion, setAskingCompletion] = useState(false)
  const [confirmingRemoval, setConfirmingRemoval] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  if (!game) return null

  async function confirmRemoval() {
    setIsRemoving(true)
    try {
      await removeGame()
      setConfirmingRemoval(false)
    } catch {
    } finally {
      setIsRemoving(false)
    }
  }

  async function handleStatusClick(statusId: number) {
    const isAlreadyActive = hasStatus(statusId)
    const hasExistingStatus = activeStatus != null
    setAskingCompletion(false)

    if (isAlreadyActive) {
      setConfirmingRemoval(true)
      return
    }

    setIsSaving(true)
    try {
      if (hasExistingStatus) {
        await updateGameStatus({ statusIds: statusId })
        if (statusId === STATUS.PLAYED && platforms.length > 1) {
          setAskingCompletion(true)
        }
      } else {
        await addGame({ statusIds: statusId })
      }
    } catch {
    } finally {
      setIsSaving(false)
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
          { statusId: STATUS.BACKLOG, icon: Library, label: 'Pendentes' },
        ]
      : []),
    { statusId: STATUS.WISHLIST, icon: Gift, label: 'Desejos' },
  ]

  async function markCompletedOn(entry: UserGamePlatformEntry) {
    try {
      await updatePlatform(entry.platform, {
        completions: entry.completions + 1,
      })
      setAskingCompletion(false)
    } catch {}
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div
        className={`grid gap-2 w-full ${
          buttons.length === 1 ? 'grid-cols-1' : 'grid-cols-4'
        }`}
      >
        {buttons.map(({ statusId, icon: Icon, label }) => {
          const active = hasStatus(statusId)
          return (
            <button
              key={statusId}
              type="button"
              onClick={() => handleStatusClick(statusId)}
              aria-pressed={active}
              disabled={isSaving}
              className={`min-h-11 flex flex-col items-center justify-center gap-1.5 px-1 py-1.5 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-60 disabled:cursor-wait group ${
                active
                  ? 'bg-primary/10 ring-1 ring-primary/30'
                  : 'hover:bg-dark-bg'
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
                className={`text-xs text-center transition-colors ${
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

      {askingCompletion && (
        <fieldset className="flex flex-col gap-2 px-3 py-2 rounded-lg bg-dark-bg">
          <legend className="float-left text-xs text-gray-300">
            Em qual plataforma você zerou?
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {platforms.map(entry => {
              const option = getLibraryPlatform(entry.platform)
              if (!option) return null
              const Icon = option.icon
              return (
                <button
                  key={entry.platform}
                  type="button"
                  onClick={() => markCompletedOn(entry)}
                  disabled={isMutating}
                  className="min-h-11 flex items-center gap-1 px-3 rounded-full border border-dark-border text-xs text-gray-300 hover:text-white hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-50"
                >
                  <Icon className="size-3" aria-hidden />
                  {option.label}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setAskingCompletion(false)}
              className="min-h-11 px-3 rounded-full text-xs text-gray-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
            >
              Pular
            </button>
          </div>
        </fieldset>
      )}

      <ConfirmDialog
        open={confirmingRemoval}
        onOpenChange={open => !open && setConfirmingRemoval(false)}
        title="Remover da biblioteca"
        description={`${game.name} sai da sua biblioteca. Status, plataformas, horas e vezes zerado registrados serão apagados.`}
        confirmLabel="Remover"
        onConfirm={confirmRemoval}
        isLoading={isRemoving}
      />
    </div>
  )
}
