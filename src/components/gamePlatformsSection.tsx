import { ChevronRight, Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { USER_GAME_STATUS_ID as STATUS } from '../constants/gameStatus'
import type {
  LibraryPlatform,
  UserGamePlatformEntry,
  UserGamePlatformPatch,
} from '../types/platform'
import {
  getAvailableLibraryPlatforms,
  getLibraryPlatform,
} from '../utils/libraryPlatforms'
import { ConfirmDialog } from './confirmDialog'
import { TotalsStrip, formatHours } from './totalsGrid'

const MAX_HOURS = 9999.99

const PLATFORM_QUESTION: Record<number, string> = {
  [STATUS.PLAYED]: 'Onde você jogou?',
  [STATUS.PLAYING]: 'Onde você está jogando?',
  [STATUS.PAUSED]: 'Onde você jogava?',
  [STATUS.BACKLOG]: 'Onde pretende jogar?',
}

const today = () => new Date().toISOString().slice(0, 10)

function stripLeadingZeros(raw: string) {
  return raw.replace(/^0+(?=\d)/, '')
}

const inputClass =
  'rounded-md bg-dark-bg px-2 py-1 text-sm text-white outline-none ring-2 ring-offset-1 ring-offset-dark-bg ring-transparent focus-visible:ring-primary-light disabled:opacity-50'

const iconButtonClass =
  'flex items-center justify-center size-6 rounded-md transition-colors text-primary hover:bg-dark-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-30 disabled:cursor-not-allowed'

export function hasPlatformData(entry: UserGamePlatformEntry) {
  return (
    (entry.hoursPlayed ?? 0) > 0 ||
    entry.completions > 0 ||
    entry.completedAt !== null
  )
}

export function PlatformEditor({
  id,
  className = 'flex flex-col gap-3',
  entry,
  isPlayed,
  disabled,
  onSave,
}: {
  id?: string
  className?: string
  entry: UserGamePlatformEntry
  isPlayed: boolean
  disabled: boolean
  onSave: (patch: UserGamePlatformPatch) => Promise<unknown>
}) {
  const option = getLibraryPlatform(entry.platform)
  const [hours, setHours] = useState(entry.hoursPlayed?.toString() ?? '')
  const [date, setDate] = useState(entry.completedAt ?? '')
  const [showCompletions, setShowCompletions] = useState(false)
  const dateId = useId()

  useEffect(() => {
    setHours(entry.hoursPlayed?.toString() ?? '')
  }, [entry.hoursPlayed])

  useEffect(() => {
    setDate(entry.completedAt ?? '')
  }, [entry.completedAt])

  const parsedHours = hours.trim() === '' ? null : Number(hours)
  const hoursValid =
    parsedHours === null ||
    (!Number.isNaN(parsedHours) && parsedHours >= 0 && parsedHours <= MAX_HOURS)
  const dateValid = date === '' || date <= today()

  const patch: UserGamePlatformPatch = {}
  if (hoursValid && parsedHours !== entry.hoursPlayed) {
    patch.hoursPlayed = parsedHours
  }
  if (isPlayed && dateValid && (date || null) !== entry.completedAt) {
    patch.completedAt = date || null
  }
  const isDirty = Object.keys(patch).length > 0

  if (!option) return null
  const completionsVisible =
    isPlayed || entry.completions > 0 || showCompletions

  return (
    <div id={id} className={className}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-400">Horas jogadas</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={MAX_HOURS}
            step="any"
            placeholder="0"
            value={hours}
            onChange={e => setHours(stripLeadingZeros(e.target.value))}
            disabled={disabled}
            aria-label={`Horas jogadas na ${option.label}`}
            aria-invalid={!hoursValid}
            className={`w-16 text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${inputClass}`}
          />
          <span className="text-xs text-gray-400">h</span>
        </div>
      </div>
      {!completionsVisible && (
        <button
          type="button"
          onClick={() => setShowCompletions(true)}
          className="self-start text-xs text-primary-light hover:underline rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
        >
          Já zerei antes nesta plataforma
        </button>
      )}

      {completionsVisible && (
        <>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-400">Vezes zerado</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSave({ completions: entry.completions - 1 })}
                disabled={disabled || entry.completions <= (isPlayed ? 1 : 0)}
                className={iconButtonClass}
                aria-label={`Diminuir vezes zerado na ${option.label}`}
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-5 text-center text-sm font-medium text-white">
                {entry.completions}
              </span>
              <button
                type="button"
                onClick={() => onSave({ completions: entry.completions + 1 })}
                disabled={disabled}
                className={iconButtonClass}
                aria-label={`Aumentar vezes zerado na ${option.label}`}
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
          {isPlayed && (
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={dateId} className="text-xs text-gray-400">
                Finalizado em
              </label>
              <input
                id={dateId}
                type="date"
                max={today()}
                value={date}
                onChange={e => setDate(e.target.value)}
                disabled={disabled}
                aria-invalid={!dateValid}
                className={`[color-scheme:dark] ${inputClass}`}
              />
            </div>
          )}
        </>
      )}

      {isDirty && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSave(patch)}
            disabled={disabled}
            className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors text-primary hover:bg-dark-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      )}
    </div>
  )
}

export function RemovePlatformButton({
  label,
  disabled,
  onClick,
  className = '',
}: {
  label: string
  disabled: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={`Remover ${label}`}
      aria-label={`Remover ${label} do jogo`}
      className={`flex items-center justify-center size-9 shrink-0 rounded-md text-gray-400 hover:text-red-400 hover:bg-dark-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-30 ${className}`}
    >
      <Trash2 className="size-4" aria-hidden />
    </button>
  )
}

function PlatformRow({
  entry,
  isPlayed,
  disabled,
  open,
  onToggle,
  onSave,
  onRemove,
}: {
  entry: UserGamePlatformEntry
  isPlayed: boolean
  disabled: boolean
  open: boolean
  onToggle: () => void
  onSave: (patch: UserGamePlatformPatch) => Promise<unknown>
  onRemove: () => void
}) {
  const option = getLibraryPlatform(entry.platform)
  const bodyId = useId()

  if (!option) return null
  const Icon = option.icon

  return (
    <div className="flex flex-col rounded-md border border-dark-border">
      <div className="flex items-center pr-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex-1 min-w-0 min-h-11 flex items-center justify-between gap-2 px-3 py-1.5 rounded-md text-left hover:bg-dark-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
        >
          <span className="flex items-center gap-2 min-w-0">
            <ChevronRight
              className={`size-3.5 shrink-0 text-gray-400 ${open ? 'rotate-90' : ''}`}
              aria-hidden
            />
            <Icon className="size-3.5 shrink-0 text-gray-300" aria-hidden />
            <span className="text-sm text-white truncate">{option.label}</span>
          </span>
          <span className="flex items-baseline gap-2 shrink-0 tabular-nums">
            <span className="text-sm text-gray-300">
              {formatHours(entry.hoursPlayed ?? 0)}
            </span>
            {entry.completions > 0 && (
              <span
                className="text-xs text-primary-light"
                aria-label={`zerado ${entry.completions} vezes`}
              >
                {entry.completions}×
              </span>
            )}
          </span>
        </button>
        <RemovePlatformButton
          label={option.label}
          disabled={disabled}
          onClick={onRemove}
        />
      </div>

      {open && (
        <PlatformEditor
          id={bodyId}
          className="flex flex-col gap-3 px-4 pb-4 pt-1"
          entry={entry}
          isPlayed={isPlayed}
          disabled={disabled}
          onSave={onSave}
        />
      )}
    </div>
  )
}

export function GamePlatformsSection({
  gamePlatforms,
  platforms,
  totalHours,
  totalCompletions,
  totalCompletedAt,
  isPlayed,
  statusId,
  disabled,
  onAdd,
  onUpdate,
  onRemove,
}: {
  gamePlatforms?: string[]
  platforms: UserGamePlatformEntry[]
  totalHours: number
  totalCompletions: number
  totalCompletedAt: string | null | undefined
  isPlayed: boolean
  statusId?: number
  disabled: boolean
  onAdd: (platform: LibraryPlatform) => Promise<unknown>
  onUpdate: (
    platform: LibraryPlatform,
    patch: UserGamePlatformPatch
  ) => Promise<unknown>
  onRemove: (platform: LibraryPlatform) => Promise<unknown>
}) {
  const [pendingRemoval, setPendingRemoval] =
    useState<UserGamePlatformEntry | null>(null)

  const [openKey, setOpenKey] = useState<LibraryPlatform | null>(null)

  const registered = platforms.map(p => p.platform)
  const addable = getAvailableLibraryPlatforms(
    gamePlatforms,
    registered
  ).filter(p => !registered.includes(p.value))

  function requestRemoval(entry: UserGamePlatformEntry) {
    if (hasPlatformData(entry)) {
      setPendingRemoval(entry)
      return
    }
    onRemove(entry.platform)
  }

  async function handleAdd(platform: LibraryPlatform) {
    try {
      await onAdd(platform)
      setOpenKey(platform)
    } catch {}
  }

  async function confirmRemoval() {
    if (!pendingRemoval) return
    await onRemove(pendingRemoval.platform)
    setPendingRemoval(null)
  }

  const pendingLabel = pendingRemoval
    ? getLibraryPlatform(pendingRemoval.platform)?.label
    : ''

  return (
    <div className="flex flex-col gap-3 w-full">
      {platforms.length > 0 && (
        <TotalsStrip
          hours={totalHours}
          completions={totalCompletions}
          completedAt={totalCompletedAt}
          hideEmptyHours={!isPlayed}
        />
      )}

      {platforms.map(entry => (
        <PlatformRow
          key={entry.platform}
          entry={entry}
          isPlayed={isPlayed}
          disabled={disabled}
          open={openKey === entry.platform}
          onToggle={() =>
            setOpenKey(openKey === entry.platform ? null : entry.platform)
          }
          onSave={patch => onUpdate(entry.platform, patch)}
          onRemove={() => requestRemoval(entry)}
        />
      ))}

      {addable.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs text-gray-400">
            {platforms.length > 0
              ? 'Adicionar plataforma'
              : (PLATFORM_QUESTION[statusId ?? STATUS.PLAYED] ??
                PLATFORM_QUESTION[STATUS.PLAYED])}
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {addable.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleAdd(value)}
                disabled={disabled}
                aria-label={`Adicionar ${label}`}
                className="relative flex items-center gap-1 px-2 py-1 rounded-full border border-dark-border text-xs text-gray-400 transition-colors motion-reduce:transition-none hover:text-gray-300 hover:border-primary/40 after:absolute after:-inset-x-0.5 after:-inset-y-2.5 after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-50"
              >
                <Plus className="size-3" aria-hidden />
                <Icon className="size-3" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <ConfirmDialog
        open={pendingRemoval !== null}
        onOpenChange={open => !open && setPendingRemoval(null)}
        title={`Remover ${pendingLabel}`}
        description={`As horas, vezes zerado e data de finalização registradas na ${pendingLabel} serão apagadas deste jogo.`}
        confirmLabel="Remover"
        onConfirm={confirmRemoval}
        isLoading={disabled}
      />
    </div>
  )
}
