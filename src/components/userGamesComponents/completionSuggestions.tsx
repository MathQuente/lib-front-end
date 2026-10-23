import { Check, ChevronRight, TriangleAlert, Undo2 } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import {
  type SuggestionRow,
  useCompletionSuggestions,
} from '../../hooks/useCompletionSuggestions'
import { focusRing } from '../../styles/focus'
import type { LibraryPlatform } from '../../types/platform'
import type { CompletionSuggestion } from '../../types/suggestion'
import { Button } from '../button'
import { formatHours } from '../totalsGrid'

const UNDO_TOAST_MS = 10000

function initials(name: string) {
  return name
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('')
}

function Cover({ suggestion }: { suggestion: CompletionSuggestion }) {
  const [failed, setFailed] = useState(false)

  if (suggestion.coverUrl && !failed) {
    return (
      <img
        src={suggestion.coverUrl}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-12 shrink-0 self-start rounded border border-dark-border bg-dark-bg-lighter object-cover aspect-[7/10]"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="grid w-12 shrink-0 self-start place-items-center rounded border border-dark-border bg-dark-bg-lighter text-[13px] font-bold text-gray-300 aspect-[7/10]"
    >
      {initials(suggestion.name)}
    </div>
  )
}

function Evidence({ suggestion }: { suggestion: CompletionSuggestion }) {
  const { hoursPlayed, normallyHours, achieved, total } = suggestion
  return (
    <p className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-300 tabular-nums">
      <span>
        {formatHours(hoursPlayed)} jogadas
        {normallyHours ? `, costuma levar ${formatHours(normallyHours)}` : ''}
      </span>
      {achieved !== null && total !== null && (
        <span>
          {achieved} de {total} conquistas
        </span>
      )}
    </p>
  )
}

function SuggestionItem({
  row,
  busy,
  onAccept,
  onDismiss,
  onUndo,
}: {
  row: SuggestionRow
  busy: boolean
  onAccept: () => void
  onDismiss: () => void
  onUndo: () => void
}) {
  const { suggestion } = row
  const noteId = useId()

  return (
    <li className="flex gap-3 rounded-md border border-dark-border bg-dark-bg-light p-3">
      <Cover suggestion={suggestion} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="break-words text-sm font-medium text-white">
          {suggestion.name}
        </p>

        {row.kind === 'accepted' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5 text-green-400">
                <Check className="size-4 shrink-0" aria-hidden="true" />
                <span className="text-white">Marcado como Jogado</span>
              </span>
              {row.canUndo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-11 gap-1.5"
                  onClick={onUndo}
                  disabled={busy}
                >
                  <Undo2 className="size-4" aria-hidden="true" />
                  Desfazer
                </Button>
              )}
            </div>
            {row.message && (
              <p className="text-xs text-red-400">{row.message}</p>
            )}
          </>
        )}

        {row.kind === 'stale' && (
          <p className="text-xs text-red-400">{row.message}</p>
        )}

        {row.kind === 'pending' && (
          <>
            <Evidence suggestion={suggestion} />
            {suggestion.lowConfidence && (
              <p className="flex items-start gap-1.5 text-xs text-amber-400">
                <TriangleAlert
                  className="mt-0.5 size-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  Tem modo multijogador: as horas podem não significar que você
                  chegou ao fim.
                </span>
              </p>
            )}
            <div className="mt-0.5 flex flex-wrap gap-2 [@media(max-width:480px)]:flex-col">
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="min-h-11 [@media(max-width:480px)]:w-full"
                onClick={onAccept}
                loading={busy}
              >
                Marcar como Jogado
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-h-11 [@media(max-width:480px)]:w-full"
                onClick={onDismiss}
                disabled={busy}
                aria-describedby={noteId}
              >
                Ainda não terminei
              </Button>
            </div>
            <p id={noteId} className="text-[11px] leading-[14px] text-gray-500">
              Não sugerimos este jogo de novo.
            </p>
          </>
        )}
      </div>
    </li>
  )
}

function plural(count: number) {
  return count === 1
    ? '1 jogo parece terminado'
    : `${count} jogos parecem terminados`
}

export function CompletionSuggestionsBlock({
  platform,
  variant,
  expectedCount,
}: {
  platform: LibraryPlatform
  variant: 'fresh' | 'last'
  expectedCount: number
}) {
  const {
    rows,
    pendingCount,
    isLoading,
    isError,
    refetch,
    isBusy,
    accept,
    dismiss,
    undo,
  } = useCompletionSuggestions(platform, true)
  const [expanded, setExpanded] = useState(false)
  const [live, setLive] = useState('')
  const autoOpened = useRef(false)
  const panelId = useId()

  useEffect(() => {
    if (variant === 'fresh' && expectedCount > 0 && !autoOpened.current) {
      autoOpened.current = true
      setExpanded(true)
    }
  }, [variant, expectedCount])

  const expectsSome = expectedCount > 0
  const empty = rows.length === 0
  const showToggle = !empty || (expectsSome && (isLoading || isError))

  let label = ''
  if (empty && isLoading) label = 'Procurando jogos terminados…'
  else if (empty && isError) label = 'Sugestões de jogos terminados'
  else if (pendingCount > 0) label = plural(pendingCount)
  else label = 'Sugestões resolvidas'

  async function handleUndo(igdbId: number, name: string) {
    const result = await undo(igdbId)
    setLive(
      result.ok
        ? `${name} voltou ao status anterior.`
        : `Não foi possível desfazer. ${result.message ?? ''}`
    )
  }

  async function handleAccept(suggestion: CompletionSuggestion) {
    const result = await accept(suggestion)
    if (!result.ok) {
      setLive(result.message ?? 'Não foi possível marcar como Jogado.')
      return
    }
    setLive(`${suggestion.name} marcado como Jogado.`)
    if (!result.canUndo) {
      toast.success(`Marcado como Jogado: ${suggestion.name}`)
      return
    }
    toast.success(
      ({ closeToast }) => (
        <div className="flex items-center justify-between gap-3">
          <span>Marcado como Jogado: {suggestion.name}</span>
          <button
            type="button"
            onClick={() => {
              closeToast?.()
              handleUndo(suggestion.igdbId, suggestion.name)
            }}
            className="min-h-11 shrink-0 rounded-sm px-1 text-sm font-semibold text-primary-link underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
          >
            Desfazer
          </button>
        </div>
      ),
      { autoClose: UNDO_TOAST_MS }
    )
  }

  async function handleDismiss(suggestion: CompletionSuggestion) {
    const result = await dismiss(suggestion)
    setLive(
      result.ok
        ? `Não vamos sugerir ${suggestion.name} de novo.`
        : (result.message ?? 'Não foi possível dispensar a sugestão.')
    )
  }

  const toggle =
    variant === 'fresh' ? (
      <button
        type="button"
        onClick={() => setExpanded(value => !value)}
        aria-expanded={expanded}
        aria-controls={expanded ? panelId : undefined}
        className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-dark-border bg-dark-bg-light px-3 py-2 text-left text-sm text-white transition-colors hover:bg-dark-bg-lighter ${focusRing}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full bg-amber-400"
            aria-hidden="true"
          />
          {label}
        </span>
        <ChevronRight
          className={`size-4 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none ${expanded ? 'rotate-90' : ''}`}
          aria-hidden="true"
        />
      </button>
    ) : (
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11"
          aria-expanded={expanded}
          aria-controls={expanded ? panelId : undefined}
          onClick={() => setExpanded(value => !value)}
        >
          {label}
        </Button>
      </div>
    )

  return (
    <div className="flex flex-col gap-2">
      <output className="sr-only">{live}</output>
      {showToggle && toggle}
      {showToggle && expanded && (
        <div id={panelId} className="flex flex-col gap-3 pt-1">
          {empty && isLoading && (
            <div
              aria-busy="true"
              className="flex gap-3 rounded-md border border-dark-border bg-dark-bg-light p-3 motion-safe:animate-pulse"
            >
              <div className="h-[68px] w-12 rounded bg-dark-bg-lighter" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-3.5 w-3/5 rounded bg-dark-bg-lighter" />
                <div className="h-3 w-4/5 rounded bg-dark-bg-lighter" />
                <div className="h-9 w-2/3 rounded bg-dark-bg-lighter" />
              </div>
            </div>
          )}

          {empty && isError && (
            <div className="flex flex-col gap-1.5 rounded-md border border-dark-border border-l-4 border-l-red-400 bg-dark-bg-light px-3 py-2">
              <p className="text-sm font-bold text-white">
                Não foi possível carregar as sugestões
              </p>
              <p className="text-xs text-gray-300">
                A conexão falhou ou o servidor não respondeu. Seus jogos não
                foram alterados.
              </p>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-11"
                  onClick={() => refetch()}
                >
                  Tentar de novo
                </Button>
              </div>
            </div>
          )}

          {!empty && (
            <>
              <p className="text-xs text-gray-400">
                Estes jogos têm horas e conquistas perto de um final. Nada muda
                até você confirmar.
              </p>
              <ul className="flex flex-col gap-2">
                {rows.map(row => (
                  <SuggestionItem
                    key={row.suggestion.igdbId}
                    row={row}
                    busy={isBusy(row.suggestion.igdbId)}
                    onAccept={() => handleAccept(row.suggestion)}
                    onDismiss={() => handleDismiss(row.suggestion)}
                    onUndo={() =>
                      handleUndo(row.suggestion.igdbId, row.suggestion.name)
                    }
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
