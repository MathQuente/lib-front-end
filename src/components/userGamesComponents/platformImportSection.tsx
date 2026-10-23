import { EyeOff } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import {
  getImportMessage,
  getSlowImportNotice,
} from '../../constants/importMessages'
import { useHiddenImportResult } from '../../hooks/useHiddenImportResult'
import type { PlatformImport } from '../../hooks/usePlatformImport'
import type { LibraryPlatform } from '../../types/platform'
import { Button } from '../button'
import { ConfirmDialog } from '../confirmDialog'
import {
  ImportResultSummary,
  type ImportResultSection,
} from '../importResultSummary'
import { fieldFocus } from '../../styles/focus'
import { CompletionSuggestionsBlock } from './completionSuggestions'
import { HiddenImportRow } from './hiddenImportRow'

const POLLING_STATUSES = ['waiting', 'active', 'delayed']

const MIN_IMPORTING_VISIBLE_MS = 1500

const CONNECTED_DESCRIPTION =
  'Importe para trazer seus jogos. Os que já estão na biblioteca continuam lá.'

function StatusPill({
  connectedId,
  connectedName,
  hideConnectedId,
  isImporting,
}: {
  connectedId: string | null
  connectedName: string | null
  hideConnectedId: boolean
  isImporting: boolean
}) {
  const dotClass = isImporting
    ? 'bg-primary-light animate-pulse motion-reduce:animate-none'
    : connectedId
      ? 'bg-green-400'
      : 'bg-gray-500'
  const text = isImporting
    ? 'Importando'
    : connectedId
      ? connectedName
        ? `Conectada como ${connectedName}`
        : hideConnectedId
          ? 'Conectada'
          : `Conectada como ${connectedId}`
      : 'Não conectada'

  return (
    <span className="flex min-w-0 items-center gap-1.5 text-xs text-gray-300">
      <span
        className={`size-2 shrink-0 rounded-full ${dotClass}`}
        aria-hidden="true"
      />
      <span className="break-words">{text}</span>
    </span>
  )
}

interface PlatformImportSectionProps<TResult> {
  icon: ReactNode
  label: string
  masculine?: boolean
  connectedId: string | null
  connectedName?: string | null
  hideConnectedId?: boolean
  inputPlaceholder?: string
  connectLabel?: string
  verificationHint?: string
  disconnectedDescription: string
  importState: PlatformImport<TResult>
  getResultSections: (result: TResult) => ImportResultSection[]
  onViewLibrary?: () => void
  suggestionsPlatform?: LibraryPlatform
}

export function PlatformImportSection<TResult>({
  icon,
  label,
  masculine = false,
  connectedId,
  connectedName = null,
  hideConnectedId = false,
  inputPlaceholder,
  connectLabel,
  verificationHint,
  disconnectedDescription,
  importState,
  getResultSections,
  onViewLibrary,
  suggestionsPlatform,
}: PlatformImportSectionProps<TResult>) {
  const article = masculine ? 'o' : 'a'
  const ofLabel = `${masculine ? 'do' : 'da'} ${label}`
  const {
    status,
    refetchStatus,
    connect,
    isConnecting,
    redirectsAway,
    requestVerification,
    isRequestingVerification,
    disconnect,
    isDisconnecting,
    startImport,
    isStarting,
    refreshAfterImport,
  } = importState

  const [profileInput, setProfileInput] = useState('')
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const [justFinished, setJustFinished] = useState(false)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)
  const previousStatus = useRef<string | undefined>(undefined)
  const progressRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLOutputElement>(null)
  const restoreRef = useRef<HTMLButtonElement>(null)
  const focusAfterToggle = useRef<'restore' | 'first' | null>(null)
  const [hideAnnouncement, setHideAnnouncement] = useState('')
  const isFirstStatusLoad = useRef(true)

  const [visuallyImporting, setVisuallyImporting] = useState(false)
  const importStartedAtRef = useRef<number | null>(null)

  const rawIsImporting = POLLING_STATUSES.includes(status?.status ?? '')

  useEffect(() => {
    if (rawIsImporting && !visuallyImporting) {
      setVisuallyImporting(true)
      importStartedAtRef.current = Date.now()
    }
  }, [rawIsImporting, visuallyImporting])

  useEffect(() => {
    if (status?.status === undefined) return

    if (isFirstStatusLoad.current) {
      isFirstStatusLoad.current = false
      previousStatus.current = status.status
      return
    }

    const wasTerminal =
      previousStatus.current === 'completed' ||
      previousStatus.current === 'failed'
    const isDone = status.status === 'completed' || status.status === 'failed'

    previousStatus.current = status.status

    if (wasTerminal || !isDone) return

    const startedAt = importStartedAtRef.current ?? Date.now()
    const remaining = Math.max(
      MIN_IMPORTING_VISIBLE_MS - (Date.now() - startedAt),
      0
    )

    const timer = setTimeout(showImportResult, remaining)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.status])

  function showImportResult() {
    setVisuallyImporting(false)
    importStartedAtRef.current = null
    setJustFinished(true)
    refreshAfterImport()
  }

  const isImporting = visuallyImporting

  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  useEffect(() => {
    if (!isImporting) {
      setElapsedSeconds(0)
      return
    }
    const interval = setInterval(() => {
      const startedAt = importStartedAtRef.current ?? Date.now()
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [isImporting])

  useEffect(() => {
    const focusLost =
      !document.activeElement || document.activeElement === document.body
    if (!focusLost) return
    if (isImporting) progressRef.current?.focus()
    else if (justFinished) resultRef.current?.focus()
  }, [isImporting, justFinished])

  const hiddenResult = useHiddenImportResult(
    label.toLowerCase(),
    status?.finishedAt
  )
  const showHiddenRow = !justFinished && hiddenResult.hidden

  // biome-ignore lint/correctness/useExhaustiveDependencies: roda quando o resultado é ocultado ou mostrado
  useEffect(() => {
    const target = focusAfterToggle.current
    focusAfterToggle.current = null
    if (target === 'restore') restoreRef.current?.focus()
    else if (target === 'first') {
      resultRef.current?.querySelector('button')?.focus()
    }
  }, [showHiddenRow])

  function hideResult() {
    focusAfterToggle.current = 'restore'
    setHideAnnouncement('Resultado da última importação oculto.')
    hiddenResult.hide()
  }

  function showResult() {
    focusAfterToggle.current = 'first'
    setHideAnnouncement('Resultado da última importação visível.')
    hiddenResult.show()
  }

  const slowImportNotice = getSlowImportNotice(elapsedSeconds)
  const progress =
    status?.status === 'active' ? (status.progress ?? 0) : undefined

  async function handleStartImport() {
    setVisuallyImporting(true)
    setJustFinished(false)
    importStartedAtRef.current = Date.now()
    try {
      await startImport()
      const fresh = await refetchStatus()
      if (fresh?.status === 'completed' || fresh?.status === 'failed') {
        previousStatus.current = fresh.status
        setTimeout(showImportResult, MIN_IMPORTING_VISIBLE_MS)
      } else {
        previousStatus.current = fresh?.status
      }
    } catch {
      setVisuallyImporting(false)
      importStartedAtRef.current = null
    }
  }

  const cooldownUntil =
    status?.status === 'completed' ? status.cooldownUntil : undefined

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!cooldownUntil) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [cooldownUntil])

  const cooldownRemainingMs = cooldownUntil ? cooldownUntil - now : 0
  const isOnCooldown = cooldownRemainingMs > 0
  const cooldownLabel = isOnCooldown
    ? (() => {
        const totalMinutes = Math.ceil(cooldownRemainingMs / 60000)
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
      })()
    : null

  async function handleConnect() {
    if (redirectsAway) {
      await connect()
      return
    }
    if (!profileInput.trim()) return
    if (!requestVerification) {
      await connect(profileInput.trim())
      setProfileInput('')
      return
    }
    const { code } = await requestVerification(profileInput.trim())
    setVerificationCode(code)
  }

  async function handleVerify() {
    await connect()
    setVerificationCode(null)
    setProfileInput('')
  }

  function handleCancelVerification() {
    setVerificationCode(null)
  }

  const showViewLibrary =
    justFinished && status?.status === 'completed' && Boolean(onViewLibrary)

  const needsInput = !connectedId && !redirectsAway
  const isAwaitingVerification = !connectedId && verificationCode !== null
  const isConnectBusy = isConnecting || isRequestingVerification

  async function handleDisconnect() {
    await disconnect()
    setDisconnectDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dark-border bg-dark-bg-darker px-3.5 py-3">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-sm text-white flex items-center gap-1.5">
            {icon}
            {label}
          </p>
          <StatusPill
            connectedId={connectedId}
            connectedName={connectedName}
            hideConnectedId={hideConnectedId}
            isImporting={isImporting}
          />
        </div>
        <p className="text-xs text-gray-400">
          {connectedId ? CONNECTED_DESCRIPTION : disconnectedDescription}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {!connectedId && (
          <div className="flex items-center gap-2">
            {needsInput && (
              <input
                type="text"
                placeholder={inputPlaceholder}
                value={profileInput}
                onChange={e => setProfileInput(e.target.value)}
                maxLength={64}
                disabled={isConnectBusy || isAwaitingVerification}
                className={`bg-dark-bg text-white placeholder-gray-500 rounded-lg block w-full text-sm py-2.5 px-3 border border-dark-border ${fieldFocus} transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed`}
              />
            )}
            {!isAwaitingVerification && (
              <Button
                type="button"
                variant="primary"
                size="md"
                className={
                  needsInput
                    ? 'px-3 py-1.5 text-sm shrink-0'
                    : 'text-sm [@media(max-width:480px)]:w-full'
                }
                onClick={handleConnect}
                disabled={(needsInput && !profileInput.trim()) || isConnectBusy}
                loading={isConnectBusy}
              >
                {redirectsAway
                  ? (connectLabel ?? `Entrar com ${article} ${label}`)
                  : 'Conectar'}
              </Button>
            )}
          </div>
        )}

        {isAwaitingVerification && (
          <div className="flex flex-col gap-2 rounded-lg border border-dark-border bg-dark-bg px-3 py-2.5">
            <p className="text-xs text-gray-300">{verificationHint}</p>
            <code className="select-all self-start rounded bg-dark-bg-lighter px-2 py-1 text-sm text-white">
              {verificationCode}
            </code>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="px-3 py-1.5 font-medium"
                onClick={handleVerify}
                disabled={isConnecting}
                loading={isConnecting}
              >
                Verificar
              </Button>
              <Button
                type="button"
                variant="cancel"
                size="sm"
                className="px-3 py-1.5 font-medium"
                onClick={handleCancelVerification}
                disabled={isConnecting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <output className="sr-only">{hideAnnouncement}</output>

        <output
          ref={resultRef}
          tabIndex={-1}
          className="flex flex-col gap-2 outline-none empty:hidden"
        >
          {connectedId &&
            !isImporting &&
            status?.status === 'completed' &&
            status.result && (
              <>
                {showHiddenRow ? (
                  <HiddenImportRow
                    ref={restoreRef}
                    platform={suggestionsPlatform}
                    memoryOnly={hiddenResult.memoryOnly}
                    onShow={showResult}
                  />
                ) : (
                  <ImportResultSummary
                    platformLabelOf={ofLabel}
                    sections={getResultSections(status.result)}
                    variant={justFinished ? 'fresh' : 'last'}
                    finishedAt={status.finishedAt}
                  />
                )}
                {suggestionsPlatform && (
                  // Continua montado quando oculto: as linhas aceitas e o "Desfazer" vivem no estado do bloco.
                  <div hidden={showHiddenRow}>
                    <CompletionSuggestionsBlock
                      platform={suggestionsPlatform}
                      variant={justFinished ? 'fresh' : 'last'}
                      expectedCount={
                        getResultSections(status.result)[0]?.result
                          .suggestions ?? 0
                      }
                    />
                  </div>
                )}
                {!showHiddenRow && !justFinished && hiddenResult.canHide && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="min-h-11 self-start gap-1.5 text-[13px] text-gray-400 hover:text-white"
                    onClick={hideResult}
                  >
                    <EyeOff className="size-4" aria-hidden="true" />
                    Ocultar até a próxima importação
                  </Button>
                )}
              </>
            )}
          {connectedId && !isImporting && status?.status === 'failed' && (
            <div className="flex flex-col gap-1 rounded-md border border-dark-border border-l-red-400 border-l-4 bg-dark-bg-light px-3 py-2">
              <p className="text-sm font-bold text-white">
                Não foi possível importar {ofLabel}
              </p>
              <p className="text-xs text-gray-300">
                {status.error ??
                  'Erro desconhecido ao importar sua biblioteca.'}
              </p>
            </div>
          )}
        </output>

        {connectedId && !isImporting && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {showViewLibrary ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                className="text-sm [@media(max-width:480px)]:w-full"
                onClick={onViewLibrary}
              >
                Ver na biblioteca
              </Button>
            ) : (
              !isOnCooldown && (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="text-sm [@media(max-width:480px)]:w-full"
                  onClick={handleStartImport}
                  loading={isStarting}
                >
                  {status?.status === 'failed'
                    ? 'Tentar de novo'
                    : `Importar ${ofLabel}`}
                </Button>
              )
            )}
            {isOnCooldown && (
              <p className="text-xs text-gray-400">
                Você pode importar de novo em {cooldownLabel}.
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="md"
              className="text-sm hover:text-white [@media(max-width:480px)]:w-full"
              onClick={() => setDisconnectDialogOpen(true)}
            >
              Desconectar
            </Button>
          </div>
        )}

        {isImporting && (
          <div
            ref={progressRef}
            tabIndex={-1}
            className="flex flex-col gap-1 outline-none"
            aria-live="polite"
          >
            {progress !== undefined && (
              <div className="h-1.5 w-full rounded-full bg-dark-bg overflow-hidden">
                <div
                  className="h-full bg-primary transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs text-gray-300">
                {getImportMessage(progress, elapsedSeconds)}
              </span>
              {progress !== undefined && (
                <span className="text-xs text-gray-400 tabular-nums shrink-0">
                  {progress}%
                </span>
              )}
            </div>
            {slowImportNotice && (
              <span className="text-xs text-gray-500">{slowImportNotice}</span>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={disconnectDialogOpen}
        onOpenChange={setDisconnectDialogOpen}
        title={`Desconectar ${label}`}
        description={`Sua conta ${label} será desvinculada. Os jogos já importados continuam na sua biblioteca.`}
        confirmLabel="Desconectar"
        onConfirm={handleDisconnect}
        isLoading={isDisconnecting}
      />
    </div>
  )
}
