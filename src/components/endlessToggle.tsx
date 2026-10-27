import { Infinity as InfinityIcon } from 'lucide-react'
import { useId } from 'react'
import { useEndless } from '../hooks/useEndless'
import { focusRing } from '../styles/focus'

export function EndlessToggle({
  igdbId,
  disabledReason = null
}: {
  igdbId: string
  disabledReason?: string | null
}) {
  const { endless, setEndless, isLoading } = useEndless(igdbId)
  const descriptionId = useId()

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-dark-bg-lighter min-h-11">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5 text-sm text-white">
          <InfinityIcon className="size-4 text-primary-light" aria-hidden />
          Infinito
        </span>
        <span id={descriptionId} className="text-xs text-gray-400">
          {disabledReason ?? 'Jogo sem fim, como MMOs e jogos como serviço'}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={endless}
        aria-label="Infinito"
        aria-describedby={descriptionId}
        aria-disabled={disabledReason != null}
        disabled={isLoading}
        onClick={() => {
          if (disabledReason == null) setEndless(!endless).catch(() => undefined)
        }}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${focusRing} ${endless ? 'bg-primary' : 'bg-dark-border'} ${disabledReason != null ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform ${endless ? 'translate-x-5' : ''}`}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
