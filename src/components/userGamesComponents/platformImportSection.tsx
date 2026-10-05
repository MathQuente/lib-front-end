import { type ReactNode, useEffect, useRef, useState } from 'react'
import {
  getImportMessage,
  getSlowImportNotice,
} from '../../constants/importMessages'
import type { PlatformImport } from '../../hooks/usePlatformImport'
import { Button } from '../button'
import { ConfirmDialog } from '../confirmDialog'
import {
  ImportResultModal,
  type ImportResultSection,
} from '../importResultModal'

const POLLING_STATUSES = ['waiting', 'active', 'delayed']

const MIN_IMPORTING_VISIBLE_MS = 1500

interface PlatformImportSectionProps<TResult> {
  icon: ReactNode
  label: string
  connectedId: string | null
  inputPlaceholder?: string
  connectLabel?: string
  verificationHint?: string
  disconnectedDescription: string
  importState: PlatformImport<TResult>
  getResultSections: (result: TResult) => ImportResultSection[]
}

export function PlatformImportSection<TResult>({
  icon,
  label,
  connectedId,
  inputPlaceholder,
  connectLabel,
  verificationHint,
  disconnectedDescription,
  importState,
  getResultSections,
}: PlatformImportSectionProps<TResult>) {
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
  const [resultModalOpen, setResultModalOpen] = useState(false)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)
  const previousStatus = useRef<string | undefined>(undefined)
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
    setResultModalOpen(true)
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

  const slowImportNotice = getSlowImportNotice(elapsedSeconds)
  const progress =
    status?.status === 'active' ? (status.progress ?? 0) : undefined

  async function handleStartImport() {
    setVisuallyImporting(true)
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
    if (connectedId) {
      setDisconnectDialogOpen(true)
      return
    }
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

  const needsInput = !connectedId && !redirectsAway
  const isAwaitingVerification = !connectedId && verificationCode !== null
  const isConnectBusy = isConnecting || isRequestingVerification

  async function handleDisconnect() {
    await disconnect()
    setDisconnectDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dark-border bg-dark-bg-darker px-3.5 py-3">
      <div>
        <p className="text-sm text-white flex items-center gap-1.5">
          {icon}
          {label}
        </p>
        <p className="text-xs text-gray-400">
          {connectedId
            ? `Sua conta ${label} está conectada.`
            : disconnectedDescription}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {(connectedId || needsInput) && (
            <input
              type="text"
              placeholder={
                connectedId ? `Conectado (${connectedId})` : inputPlaceholder
              }
              value={profileInput}
              onChange={e => setProfileInput(e.target.value)}
              maxLength={64}
              disabled={
                isConnectBusy || !!connectedId || isAwaitingVerification
              }
              className="bg-dark-bg text-white placeholder-gray-500 rounded-lg block w-full text-sm py-2.5 px-3 border border-dark-border focus:border-primary outline-none ring-2 ring-offset-1 ring-offset-dark-bg ring-transparent focus-visible:ring-primary-light transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          )}
          {!isAwaitingVerification && (
            <Button
              type="button"
              variant={connectedId ? 'cancel' : 'primary'}
              size="sm"
              className="px-3 py-1.5 font-medium shrink-0"
              onClick={handleConnect}
              disabled={(needsInput && !profileInput.trim()) || isConnectBusy}
              loading={isConnectBusy}
            >
              {connectedId
                ? 'Desconectar'
                : redirectsAway
                  ? (connectLabel ?? `Entrar com a ${label}`)
                  : 'Conectar'}
            </Button>
          )}
        </div>

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

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={handleStartImport}
            disabled={!connectedId || isImporting || isStarting || isOnCooldown}
            loading={isStarting}
          >
            {isImporting ? 'Importando...' : `Importar da ${label}`}
          </Button>
          {!isImporting && isOnCooldown && (
            <span className="text-xs text-gray-400">
              Você pode importar novamente em {cooldownLabel}.
            </span>
          )}
        </div>

        {isImporting && (
          <div className="flex flex-col gap-1" aria-live="polite">
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

      <ImportResultModal
        open={resultModalOpen}
        onOpenChange={setResultModalOpen}
        platformLabel={label}
        status={status?.status}
        error={status?.error}
        sections={status?.result ? getResultSections(status.result) : []}
      />

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
