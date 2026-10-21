import { CircleX, Gamepad2, type LucideIcon, Pause, Play } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { USER_GAME_STATUS_ID as STATUS } from '../constants/gameStatus'
import { useAddGame } from '../hooks/useAddGame'
import { useGameStatus } from '../hooks/useGameStatus'
import { focusRing } from '../styles/focus'

const OPTIONS: { statusId: number; icon: LucideIcon; label: string }[] = [
  { statusId: STATUS.PLAYED, icon: Gamepad2, label: 'Jogado' },
  { statusId: STATUS.PLAYING, icon: Play, label: 'Jogando' },
  { statusId: STATUS.PAUSED, icon: Pause, label: 'Pausado' },
  { statusId: STATUS.DROPPED, icon: CircleX, label: 'Larguei' }
]

export function ReviewStatusPicker({
  igdbId,
  inLibrary,
  inBacklog = false,
  onPicked
}: {
  igdbId: string
  inLibrary: boolean
  inBacklog?: boolean
  onPicked?: () => void
}) {
  const { updateGameStatus } = useGameStatus(igdbId)
  const { addGame } = useAddGame(igdbId)
  const [pending, setPending] = useState<number | null>(null)
  const questionId = useId()
  const playedNoteId = useId()

  async function pick(statusId: number) {
    setPending(statusId)
    try {
      if (inLibrary) await updateGameStatus({ statusIds: statusId })
      else await addGame({ statusIds: statusId })
      onPicked?.()
    } catch {
      return
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p id={questionId} className="text-sm text-gray-300">
        Resenhas são de jogos que você já começou. Em que ponto você está com
        este jogo?
      </p>
      <div
        role="group"
        aria-labelledby={questionId}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
      >
        {OPTIONS.map(({ statusId, icon: Icon, label }) => (
          <button
            key={statusId}
            type="button"
            disabled={pending !== null}
            aria-describedby={
              statusId === STATUS.PLAYED ? playedNoteId : undefined
            }
            onClick={() => pick(statusId)}
            className={`min-h-11 flex items-center justify-center gap-2 rounded-lg border border-dark-border px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-bg transition-colors disabled:opacity-60 disabled:cursor-wait ${focusRing}`}
          >
            <Icon className="size-4 text-primary-link" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-0.5 text-xs text-gray-400">
        {!inLibrary && <p>O jogo será adicionado à sua biblioteca.</p>}
        <p id={playedNoteId}>Jogado também conta uma zerada na sua biblioteca.</p>
        {inBacklog && (
          <p>
            Se você já jogou e quer manter na fila, registre horas ou uma
            finalização em{' '}
            <Link
              to={`/games/${igdbId}#biblioteca`}
              className={`text-primary-link hover:text-white transition-colors rounded-sm ${focusRing}`}
            >
              Minha biblioteca
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  )
}
