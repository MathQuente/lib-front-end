import {
  CircleX,
  Gamepad2,
  Gift,
  Library,
  type LucideIcon,
  Pause,
  Play,
} from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { USER_GAME_STATUS_ID as STATUS } from '../../constants/gameStatus'
import { useAddGame } from '../../hooks/useAddGame'
import { useCompletedAt } from '../../hooks/useCompletedAt'
import { useGamePlatforms } from '../../hooks/useGamePlatforms'
import { useGameStatus } from '../../hooks/useGameStatus'
import { useHoursPlayed } from '../../hooks/useHoursPlayed'
import { usePlayedCount } from '../../hooks/usePlayedCount'
import { useRating } from '../../hooks/useRating'
import type { GameFormProps } from '../../interfaces/games'
import { focusRing } from '../../styles/focus'
import type { UserGamePlatformEntry } from '../../types/platform'
import { getLibraryPlatform } from '../../utils/libraryPlatforms'
import { entryDisplayName, entryKey } from '../../utils/platformConsoles'
import { ConfirmDialog } from '../confirmDialog'

interface StatusButton {
  statusId: number
  icon: LucideIcon
  label: string
}

const STOPPABLE_STATUS_IDS: number[] = [
  STATUS.PLAYING,
  STATUS.PAUSED,
  STATUS.DROPPED,
]

const STOPPED_BUTTONS: StatusButton[] = [
  { statusId: STATUS.PAUSED, icon: Pause, label: 'Pausado' },
  { statusId: STATUS.DROPPED, icon: CircleX, label: 'Larguei' },
]

export function GameStatusButtons({ game }: GameFormProps) {
  const igdbId = game?.igdbId?.toString()
  const { gameStatus, updateGameStatus } = useGameStatus(igdbId)
  const { addGame, removeGame } = useAddGame(igdbId)

  const activeStatus = gameStatus?.userGameStatus
  const hasStatus = (statusId: number) => activeStatus?.id === statusId
  const canHavePlatforms = !!activeStatus && activeStatus.id !== STATUS.WISHLIST

  const { platforms, updatePlatform, isMutating, isLoading, isError } =
    useGamePlatforms(igdbId ?? '', canHavePlatforms)
  const libraryId = activeStatus ? igdbId : undefined
  const {
    userRating,
    isLoading: isLoadingRating,
    isError: isErrorRating,
  } = useRating(libraryId)
  const { completions, isFetchingCompletions, isErrorCompletions } =
    usePlayedCount(libraryId ?? '')
  const { hoursPlayed, isFetchingHours, isErrorHours } = useHoursPlayed(
    libraryId ?? ''
  )
  const { completedAt, isFetchingCompletedAt, isErrorCompletedAt } =
    useCompletedAt(libraryId ?? '')
  const isCheckingWishlistLoss =
    isLoading ||
    isLoadingRating ||
    isFetchingCompletions ||
    isFetchingHours ||
    isFetchingCompletedAt
  const failedCheckingWishlistLoss =
    isError ||
    isErrorRating ||
    isErrorCompletions ||
    isErrorHours ||
    isErrorCompletedAt
  const hasDataToLose =
    platforms.length > 0 ||
    userRating !== null ||
    completions > 0 ||
    hoursPlayed > 0 ||
    completedAt !== null
  const needsWishlistConfirmation =
    isCheckingWishlistLoss || failedCheckingWishlistLoss || hasDataToLose

  const [askingCompletion, setAskingCompletion] = useState(false)
  const [confirmingRemoval, setConfirmingRemoval] = useState(false)
  const [confirmingWishlist, setConfirmingWishlist] = useState(false)
  const [isMovingToWishlist, setIsMovingToWishlist] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [completionPending, setCompletionPending] = useState(false)
  const completionRef = useRef<HTMLFieldSetElement>(null)
  const completionHintId = useId()
  const completionTitleId = useId()

  useEffect(() => {
    if (askingCompletion)
      completionRef.current
        ?.querySelector<HTMLButtonElement>('[data-completion-option]')
        ?.focus()
  }, [askingCompletion])

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

  async function confirmWishlist() {
    setIsMovingToWishlist(true)
    try {
      await updateGameStatus({ statusIds: STATUS.WISHLIST })
      setConfirmingWishlist(false)
    } catch {
    } finally {
      setIsMovingToWishlist(false)
    }
  }

  async function handleStatusClick(statusId: number) {
    const isAlreadyActive = hasStatus(statusId)
    const hasExistingStatus = activeStatus != null
    setAskingCompletion(false)

    if (isAlreadyActive) {
      if (statusId === STATUS.PLAYED && completionPending) {
        setAskingCompletion(true)
        return
      }
      setConfirmingRemoval(true)
      return
    }

    if (
      hasExistingStatus &&
      statusId === STATUS.WISHLIST &&
      needsWishlistConfirmation
    ) {
      setConfirmingWishlist(true)
      return
    }

    setIsSaving(true)
    try {
      if (hasExistingStatus) {
        if (statusId === STATUS.PLAYED && platforms.length > 1) {
          setAskingCompletion(true)
          return
        }
        await updateGameStatus({ statusIds: statusId })
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

  const buttons: StatusButton[] = [
    ...(gameIsReleased
      ? [
          { statusId: STATUS.PLAYED, icon: Gamepad2, label: 'Jogado' },
          { statusId: STATUS.PLAYING, icon: Play, label: 'Jogando' },
          { statusId: STATUS.BACKLOG, icon: Library, label: 'Na fila' },
        ]
      : []),
    { statusId: STATUS.WISHLIST, icon: Gift, label: 'Desejos' },
  ]

  async function applyPlayed(entry: UserGamePlatformEntry | null) {
    setIsSaving(true)
    try {
      if (!hasStatus(STATUS.PLAYED)) {
        await updateGameStatus({ statusIds: STATUS.PLAYED })
      }
      if (entry) {
        setCompletionPending(true)
        await updatePlatform(entry.platform, entry.console, {
          completions: entry.completions + 1,
        })
      }
      setCompletionPending(false)
      setAskingCompletion(false)
    } catch {
    } finally {
      setIsSaving(false)
    }
  }

  function cancelCompletion() {
    setAskingCompletion(false)
    setCompletionPending(false)
  }

  const canStop =
    !!activeStatus && STOPPABLE_STATUS_IDS.includes(activeStatus.id)

  function renderStatusButton({ statusId, icon: Icon, label }: StatusButton) {
    const active = hasStatus(statusId)
    const choosing = askingCompletion && statusId === STATUS.PLAYED
    return (
      <button
        key={statusId}
        type="button"
        onClick={() => handleStatusClick(statusId)}
        aria-pressed={active}
        disabled={
          isSaving ||
          (statusId === STATUS.PLAYED &&
            canHavePlatforms &&
            (isLoading || isError))
        }
        className={`min-h-11 flex flex-col items-center justify-center gap-1.5 px-1 py-1.5 rounded-lg transition-colors ${focusRing} disabled:opacity-60 disabled:cursor-wait group ${
          active
            ? 'bg-primary/10'
            : choosing
              ? 'bg-primary/5 ring-1 ring-primary/50'
              : 'hover:bg-dark-bg'
        }`}
      >
        <Icon
          className={`size-6 transition-colors ${
            active || choosing
              ? 'text-primary-light'
              : 'text-gray-400 group-hover:text-gray-300'
          }`}
        />
        <span
          className={`text-xs text-center transition-colors ${
            active || choosing
              ? 'text-primary-link font-medium'
              : 'text-gray-400 group-hover:text-gray-300'
          }`}
        >
          {label}
        </span>
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="grid gap-2 w-full grid-cols-4">
        {buttons.map(renderStatusButton)}
      </div>

      {canStop && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Parou de jogar?</span>
          <div className="grid w-full grid-cols-4 gap-2">
            {STOPPED_BUTTONS.map(renderStatusButton)}
          </div>
        </div>
      )}

      {askingCompletion && (
        <fieldset
          ref={completionRef}
          aria-labelledby={completionTitleId}
          aria-describedby={completionHintId}
          className="flex min-w-0 flex-col gap-1 rounded-lg border border-dark-border bg-dark-bg px-2.5 py-1.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span id={completionTitleId} className="text-xs text-gray-300">
              Em qual plataforma você zerou?
            </span>
            <button
              type="button"
              onClick={cancelCompletion}
              disabled={isSaving}
              className={`relative inline-flex min-h-6 items-center rounded-md px-2 text-xs text-gray-400 transition-colors after:absolute after:-inset-y-2.5 after:inset-x-0 after:content-[''] hover:text-white ${focusRing} disabled:opacity-50`}
            >
              Cancelar
            </button>
          </div>
          <p id={completionHintId} className="sr-only">
            Soma 1 zerada na plataforma escolhida e marca o jogo como Jogado.
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {platforms.map(entry => {
              const option = getLibraryPlatform(entry.platform)
              if (!option) return null
              const Icon = option.icon
              return (
                <button
                  key={entryKey(entry)}
                  type="button"
                  data-completion-option
                  onClick={() => applyPlayed(entry)}
                  disabled={isMutating || isSaving}
                  className={`relative inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs transition-colors after:absolute after:-inset-y-1 after:inset-x-0 after:content-[''] ${focusRing} disabled:opacity-50 border border-dark-border bg-dark-bg-light text-gray-200 hover:border-primary/50 hover:text-white`}
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">
                    {entryDisplayName(entry, option.label)}
                  </span>
                </button>
              )
            })}
            <button
              type="button"
              data-completion-option
              onClick={() => applyPlayed(null)}
              aria-label="Só marcar como Jogado"
              title="Só marcar como Jogado, sem registrar a zerada em uma plataforma"
              disabled={isMutating || isSaving}
              className={`relative inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs transition-colors after:absolute after:-inset-y-1 after:inset-x-0 after:content-[''] ${focusRing} disabled:opacity-50 border border-dashed border-dark-border text-gray-300 hover:border-primary/50 hover:text-white`}
            >
              Só marcar
            </button>
          </div>
        </fieldset>
      )}

      <ConfirmDialog
        open={confirmingWishlist}
        onOpenChange={open => !open && setConfirmingWishlist(false)}
        title="Mover para a lista de desejos?"
        description={`${game.name} vai para a lista de desejos. Nota, plataformas, horas, vezes zerado e data de conclusão registrados serão apagados.`}
        confirmLabel="Mover"
        onConfirm={confirmWishlist}
        isLoading={isMovingToWishlist}
        lockWhileLoading
      />

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
