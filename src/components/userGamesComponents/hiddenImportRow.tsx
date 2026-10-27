import { EyeOff } from 'lucide-react'
import { forwardRef, useId } from 'react'
import { useCompletionSuggestions } from '../../hooks/useCompletionSuggestions'
import { focusRing } from '../../styles/focus'
import type { LibraryPlatform } from '../../types/platform'

function Dot() {
  return (
    <span
      className="size-2 shrink-0 rounded-full bg-amber-400"
      aria-hidden="true"
    />
  )
}

export const HiddenImportRow = forwardRef<
  HTMLButtonElement,
  {
    platform?: LibraryPlatform
    memoryOnly: boolean
    onShow: () => void
  }
>(function HiddenImportRow({ platform, memoryOnly, onShow }, ref) {
  const tipId = useId()
  const suggestions = useCompletionSuggestions(
    platform ?? 'STEAM',
    Boolean(platform)
  )
  const pendingCount = platform ? suggestions.pendingCount : 0

  const tip = `Volta sozinho depois da próxima importação.${
    memoryOnly ? ' Só vale até fechar esta janela.' : ''
  }`
  const pendingTip =
    pendingCount === 1
      ? ' 1 jogo esperando revisão.'
      : ` ${pendingCount} jogos esperando revisão.`

  return (
    <div
      title={tip}
      className="flex min-h-9 items-center justify-between gap-2 rounded-md border border-dashed border-dark-border py-0.5 pl-2.5 pr-1"
    >
      <span className="flex min-w-0 items-center gap-2 text-[13px] text-gray-400">
        <EyeOff className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">Importação oculta</span>
        {pendingCount > 0 && (
          <span
            className={
              'inline-flex items-center gap-1.5 text-xs tabular-nums text-gray-300 [@media(max-width:520px)]:hidden'
            }
          >
            <Dot />
            {pendingCount} para revisar
          </span>
        )}
        {memoryOnly && (
          <span
            className={
              'text-xs text-amber-400 [@media(max-width:520px)]:hidden'
            }
          >
            só nesta janela
          </span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-1">
        {pendingCount > 0 && (
          <span
            aria-hidden="true"
            className={
              'hidden items-center gap-1.5 text-xs tabular-nums text-gray-300 [@media(max-width:520px)]:inline-flex'
            }
          >
            <Dot />
            {pendingCount}
          </span>
        )}
        <button
          ref={ref}
          type="button"
          onClick={onShow}
          aria-describedby={tipId}
          className={`relative rounded px-2 py-1 text-[13px] font-medium text-primary-link transition-colors hover:bg-dark-bg-lighter hover:text-white after:absolute after:-inset-2 after:content-[''] ${focusRing}`}
        >
          Mostrar
        </button>
      </span>
      <span id={tipId} className="sr-only">
        {tip}
        {pendingCount > 0 ? pendingTip : ''}
      </span>
    </div>
  )
})
