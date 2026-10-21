import { Infinity as InfinityIcon } from 'lucide-react'
import { useId } from 'react'
import { useEndless } from '../../hooks/useEndless'
import { focusRing } from '../../styles/focus'

export function EndlessChip({
  igdbId,
  disabledReason = null
}: {
  igdbId: string
  // quando presente, o chip fica inativo e o motivo aparece ao lado
  disabledReason?: string | null
}) {
  const reasonId = useId()
  const { endless, setEndless, isLoading } = useEndless(igdbId)
  const isLocked = disabledReason != null

  return (
    <div className="flex flex-wrap items-center gap-x-3 -my-2 self-start">
      <button
        type="button"
        onClick={() => {
          if (!isLocked) setEndless(!endless).catch(() => undefined)
        }}
        aria-pressed={endless}
        aria-disabled={isLocked}
        aria-describedby={isLocked ? reasonId : undefined}
        disabled={isLoading}
        title={isLocked ? undefined : 'Jogo sem fim, como MMOs e jogos como serviço'}
        className={`group min-h-11 flex items-center rounded-full disabled:opacity-60 disabled:cursor-wait ${isLocked ? 'cursor-not-allowed opacity-60' : ''} ${focusRing}`}
      >
        <span
          className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors ${
            endless
              ? 'border-primary bg-primary font-medium text-white'
              : `border-dark-border text-gray-400 ${isLocked ? '' : 'group-hover:text-white'}`
          }`}
        >
          <InfinityIcon className="size-3.5" aria-hidden />
          Jogo sem fim
        </span>
      </button>
      {isLocked && (
        <span id={reasonId} className="text-xs text-gray-400">
          {disabledReason}
        </span>
      )}
    </div>
  )
}
