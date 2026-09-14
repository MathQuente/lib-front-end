import { useEffect, useRef, useState } from 'react'
import { Button } from '../button'
import { SteamImportResultModal } from '../steamImportResultModal'
import { useSteamImport } from '../../hooks/useSteamImport'

const POLLING_STATUSES = ['waiting', 'active', 'delayed']

export function SteamImportSection({
  steamId
}: {
  steamId: string | null
}) {
  const {
    status,
    connectSteam,
    isConnecting,
    startImport,
    isStarting,
    refreshAfterImport
  } = useSteamImport()

  const [profileInput, setProfileInput] = useState('')
  const [resultModalOpen, setResultModalOpen] = useState(false)
  const previousStatus = useRef<string | undefined>(undefined)
  const isFirstStatusLoad = useRef(true)

  useEffect(() => {
    if (status?.status === undefined) return

    // The first status this mount ever sees just sets the baseline —
    // otherwise a leftover completed/failed job from a previous import
    // would pop the result modal back open every time the profile modal
    // is reopened, not only on a transition that happens while watching.
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

  async function handleConnect() {
    if (!profileInput.trim()) return
    await connectSteam(profileInput.trim())
    setProfileInput('')
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dark-border bg-dark-bg-darker px-3.5 py-3">
      <div>
        <p className="text-sm text-white">Steam</p>
        <p className="text-xs text-gray-400">
          {steamId
            ? 'Sua conta Steam está conectada.'
            : 'Conecte sua conta pra importar sua biblioteca automaticamente.'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={
              steamId ? `Conectado (${steamId})` : 'Link do perfil ou SteamID'
            }
            value={profileInput}
            onChange={e => setProfileInput(e.target.value)}
            disabled={isConnecting}
            className="bg-dark-bg text-white placeholder-gray-500 rounded-lg block w-full text-sm py-2.5 px-3 border border-dark-border focus:border-primary outline-2 outline-offset-1 outline-transparent focus-visible:outline-primary-light transition-colors duration-150"
          />
          <Button
            type="button"
            variant="cancel"
            size="md"
            onClick={handleConnect}
            disabled={!profileInput.trim() || isConnecting}
            loading={isConnecting}
          >
            Conectar
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => startImport()}
            disabled={!steamId || isImporting || isStarting}
            loading={isStarting}
          >
            {isImporting ? 'Importando...' : 'Importar da Steam'}
          </Button>
          {isImporting && (
            <span className="text-xs text-gray-400">
              Importando sua biblioteca... isso pode levar um tempo.
            </span>
          )}
        </div>
      </div>

      <SteamImportResultModal
        open={resultModalOpen}
        onOpenChange={setResultModalOpen}
        status={status}
      />
    </div>
  )
}
