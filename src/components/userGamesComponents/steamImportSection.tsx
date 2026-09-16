import { useEffect, useRef, useState } from 'react'
import { FaSteam } from 'react-icons/fa'
import { Button } from '../button'
import { ConfirmDialog } from '../confirmDialog'
import { SteamImportResultModal } from '../steamImportResultModal'
import { useSteamImport } from '../../hooks/useSteamImport'

const POLLING_STATUSES = ['waiting', 'active', 'delayed']

export function SteamImportSection({ steamId }: { steamId: string | null }) {
  const {
    status,
    connectSteam,
    isConnecting,
    disconnectSteam,
    isDisconnecting,
    startImport,
    isStarting,
    refreshAfterImport
  } = useSteamImport()

  const [profileInput, setProfileInput] = useState('')
  const [resultModalOpen, setResultModalOpen] = useState(false)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)
  const previousStatus = useRef<string | undefined>(undefined)
  const isFirstStatusLoad = useRef(true)

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

    if (!wasTerminal && isDone) {
      setResultModalOpen(true)
      refreshAfterImport()
    }

    previousStatus.current = status.status
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.status])

  const isImporting = POLLING_STATUSES.includes(status?.status ?? '')
  const progress =
    status?.status === 'active' ? (status.progress ?? 0) : undefined

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
    if (steamId) {
      setDisconnectDialogOpen(true)
      return
    }
    if (!profileInput.trim()) return
    await connectSteam(profileInput.trim())
    setProfileInput('')
  }

  async function handleDisconnect() {
    await disconnectSteam()
    setDisconnectDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dark-border bg-dark-bg-darker px-3.5 py-3">
      <div>
        <p className="text-sm text-white flex items-center gap-1.5">
          <FaSteam className="size-4 text-gray-300" aria-hidden="true" />
          Steam
        </p>
        <p className="text-xs text-gray-400">
          {steamId
            ? 'Sua conta Steam está conectada.'
            : 'Conecte sua conta pra importar sua biblioteca automaticamente.'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={
              steamId ? `Conectado (${steamId})` : 'Link do perfil ou SteamID'
            }
            value={profileInput}
            onChange={e => setProfileInput(e.target.value)}
            disabled={isConnecting || !!steamId}
            className="bg-dark-bg text-white placeholder-gray-500 rounded-lg block w-full text-sm py-2.5 px-3 border border-dark-border focus:border-primary outline-2 outline-offset-1 outline-transparent focus-visible:outline-primary-light transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <Button
            type="button"
            variant={steamId ? 'cancel' : 'primary'}
            size="sm"
            className="px-3 py-1.5 font-medium shrink-0"
            onClick={handleConnect}
            disabled={(!steamId && !profileInput.trim()) || isConnecting}
            loading={isConnecting}
          >
            {steamId ? 'Desconectar' : 'Conectar'}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => startImport()}
            disabled={!steamId || isImporting || isStarting || isOnCooldown}
            loading={isStarting}
          >
            {isImporting ? 'Importando...' : 'Importar da Steam'}
          </Button>
          {isImporting && progress === undefined && (
            <span className="text-xs text-gray-400">
              Importando sua biblioteca... isso pode levar um tempo.
            </span>
          )}
          {!isImporting && isOnCooldown && (
            <span className="text-xs text-gray-400">
              Você pode importar novamente em {cooldownLabel}.
            </span>
          )}
        </div>

        {isImporting && progress !== undefined && (
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-full rounded-full bg-dark-bg overflow-hidden">
              <div
                className="h-full bg-primary transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">
              Importando sua biblioteca... {progress}%
            </span>
          </div>
        )}
      </div>

      <SteamImportResultModal
        open={resultModalOpen}
        onOpenChange={setResultModalOpen}
        status={status}
      />

      <ConfirmDialog
        open={disconnectDialogOpen}
        onOpenChange={setDisconnectDialogOpen}
        title="Desconectar Steam"
        description="Sua conta Steam será desvinculada. Os jogos já importados continuam na sua biblioteca."
        confirmLabel="Desconectar"
        onConfirm={handleDisconnect}
        isLoading={isDisconnecting}
      />
    </div>
  )
}
