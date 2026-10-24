import { ChevronRight, Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { toast } from 'react-toastify'
import { USER_GAME_STATUS_ID as STATUS } from '../constants/gameStatus'
import type {
  LibraryPlatform,
  PlatformConsole,
  UserGamePlatformEntry,
  UserGamePlatformPatch,
  UserGamePlatformsResponse,
} from '../types/platform'
import {
  getAvailableLibraryPlatforms,
  getLibraryPlatform,
} from '../utils/libraryPlatforms'
import {
  consoleGroupsFor,
  consoleLabel,
  consolesForGame,
  entryDisplayName,
  entryHint,
  entryKey,
  hasFreeConsole,
  platformAsksConsole,
  singleConsoleFor,
} from '../utils/platformConsoles'
import { ConfirmDialog } from './confirmDialog'
import { Button } from './button'
import { IconButton } from './iconButton'
import { TotalsStrip, formatHours } from './totalsGrid'
import { inlineFieldFocus } from '../styles/focus'

const MAX_HOURS = 9999.99

const PLATFORM_QUESTION: Record<number, string> = {
  [STATUS.PLAYED]: 'Onde você jogou?',
  [STATUS.PLAYING]: 'Onde você está jogando?',
  [STATUS.PAUSED]: 'Onde você jogava?',
  [STATUS.BACKLOG]: 'Onde pretende jogar?',
  [STATUS.DROPPED]: 'Onde você jogava?',
}

const today = () => new Date().toISOString().slice(0, 10)

function stripLeadingZeros(raw: string) {
  return raw.replace(/^0+(?=\d)/, '')
}

const inputClass = `rounded-md bg-dark-bg px-2 py-1 text-sm text-white ${inlineFieldFocus} disabled:opacity-50`

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
  const name = option ? entryDisplayName(entry, option.label) : ''
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
            aria-label={`Horas jogadas em ${name}`}
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
          className="self-start text-xs text-primary-link hover:underline rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
        >
          Já zerei antes nesta plataforma
        </button>
      )}

      {completionsVisible && (
        <>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-400">Vezes zerado</span>
            <div className="flex items-center gap-2">
              <IconButton
                variant="bare"
                onClick={() => onSave({ completions: entry.completions - 1 })}
                disabled={disabled || entry.completions <= (isPlayed ? 1 : 0)}
                aria-label={`Diminuir vezes zerado em ${name}`}
              >
                <Minus className="size-3.5" />
              </IconButton>
              <span className="w-5 text-center text-sm font-medium text-white">
                {entry.completions}
              </span>
              <IconButton
                variant="bare"
                onClick={() => onSave({ completions: entry.completions + 1 })}
                disabled={disabled}
                aria-label={`Aumentar vezes zerado em ${name}`}
              >
                <Plus className="size-3.5" />
              </IconButton>
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
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onSave(patch)}
            disabled={disabled}
          >
            Salvar
          </Button>
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
    <IconButton
      variant="bare"
      size="md"
      tone="danger"
      onClick={onClick}
      disabled={disabled}
      title={`Remover ${label}`}
      aria-label={`Remover ${label} do jogo`}
      className={className}
    >
      <Trash2 className="size-4" aria-hidden />
    </IconButton>
  )
}

function PlatformRow({
  entry,
  hint,
  isPlayed,
  disabled,
  open,
  onToggle,
  onSave,
  onRemove,
}: {
  entry: UserGamePlatformEntry
  hint: string | null
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
  const name = entryDisplayName(entry, option.label)

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
            <span className="flex min-w-0 flex-col">
              <span className="text-sm text-white truncate">{name}</span>
              {hint && <span className="text-xs text-gray-400 truncate">{hint}</span>}
            </span>
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
          label={name}
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

function ConsolePicker({
  platform,
  platformLabel,
  released,
  taken,
  disabled,
  onCancel,
  onConfirm,
}: {
  platform: LibraryPlatform
  platformLabel: string
  released: Set<PlatformConsole> | null
  taken: PlatformConsole[]
  disabled: boolean
  onCancel: () => void
  onConfirm: (value: PlatformConsole) => void
}) {
  const selectId = useId()
  const [value, setValue] = useState<PlatformConsole | ''>('')
  const groups = consoleGroupsFor(platform, released)
    .map(group => ({
      ...group,
      consoles: group.consoles.filter(c => !taken.includes(c)),
    }))
    .filter(group => group.consoles.length > 0)
  const grouped = groups.length > 1

  return (
    <div className="mt-2 flex flex-col gap-2 rounded-md border border-dark-border p-3">
      <label htmlFor={selectId} className="text-xs text-gray-400">
        Em qual console? ({platformLabel})
      </label>
      <select
        id={selectId}
        value={value}
        onChange={e => setValue(e.target.value as PlatformConsole)}
        disabled={disabled}
        className={`w-full min-h-11 ${inputClass}`}
      >
        <option value="" disabled>
          Escolha o console
        </option>
        {groups.map(group =>
          grouped ? (
            <optgroup key={group.label} label={group.label}>
              {group.consoles.map(c => (
                <option key={c} value={c}>
                  {consoleLabel(c)}
                </option>
              ))}
            </optgroup>
          ) : (
            group.consoles.map(c => (
              <option key={c} value={c}>
                {consoleLabel(c)}
              </option>
            ))
          )
        )}
      </select>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={disabled || value === ''}
          onClick={() => value !== '' && onConfirm(value)}
        >
          Adicionar
        </Button>
      </div>
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
  onAdd: (
    platform: LibraryPlatform,
    gameConsole: PlatformConsole
  ) => Promise<UserGamePlatformsResponse>
  onUpdate: (
    platform: LibraryPlatform,
    gameConsole: PlatformConsole,
    patch: UserGamePlatformPatch
  ) => Promise<unknown>
  onRemove: (
    platform: LibraryPlatform,
    gameConsole: PlatformConsole
  ) => Promise<unknown>
}) {
  const [pendingRemoval, setPendingRemoval] =
    useState<UserGamePlatformEntry | null>(null)

  const [openKey, setOpenKey] = useState<string | null>(null)
  const [pickingFor, setPickingFor] = useState<LibraryPlatform | null>(null)

  const releasedConsoles = consolesForGame(gamePlatforms)
  const registered = platforms.map(p => p.platform)
  const addable = getAvailableLibraryPlatforms(
    gamePlatforms,
    registered
  ).filter(p =>
    platformAsksConsole(p.value)
      ? hasFreeConsole(p.value, platforms, releasedConsoles)
      : !registered.includes(p.value)
  )

  function requestRemoval(entry: UserGamePlatformEntry) {
    setPendingRemoval(entry)
  }

  async function addWithConsole(
    platform: LibraryPlatform,
    gameConsole: PlatformConsole
  ) {
    const hadUnknown = platforms.some(
      p => p.platform === platform && p.console === 'UNKNOWN'
    )
    try {
      const next = await onAdd(platform, gameConsole)
      setPickingFor(null)
      setOpenKey(entryKey({ platform, console: gameConsole }))
      const adopted =
        hadUnknown &&
        next.platforms.length === platforms.length &&
        !next.platforms.some(
          p => p.platform === platform && p.console === 'UNKNOWN'
        )
      if (adopted) {
        toast.info(
          `O registro sem console virou ${consoleLabel(gameConsole)}; nenhuma plataforma nova foi criada.`
        )
      }
    } catch {}
  }

  function handleAdd(platform: LibraryPlatform) {
    if (platformAsksConsole(platform)) {
      const only = singleConsoleFor(platform, platforms, releasedConsoles)
      if (only) {
        addWithConsole(platform, only)
        return
      }
      setPickingFor(pickingFor === platform ? null : platform)
      return
    }
    addWithConsole(platform, 'UNKNOWN')
  }

  async function confirmRemoval() {
    if (!pendingRemoval) return
    try {
      await onRemove(pendingRemoval.platform, pendingRemoval.console)
      setPendingRemoval(null)
    } catch {}
  }

  const pendingPlatformLabel = pendingRemoval
    ? getLibraryPlatform(pendingRemoval.platform)?.label
    : undefined
  const pendingLabel =
    pendingRemoval && pendingPlatformLabel
      ? entryDisplayName(pendingRemoval, pendingPlatformLabel)
      : ''

  const multiConsolePlatforms = Array.from(
    new Set(platforms.map(p => p.platform))
  ).filter(
    platform =>
      platforms.filter(p => p.platform === platform && p.console !== 'UNKNOWN')
        .length >= 2
  )

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

      {platforms.map(entry => {
        const key = entryKey(entry)
        return (
          <PlatformRow
            key={key}
            entry={entry}
            hint={entryHint(entry, platforms)}
            isPlayed={isPlayed}
            disabled={disabled}
            open={openKey === key}
            onToggle={() => setOpenKey(openKey === key ? null : key)}
            onSave={patch => onUpdate(entry.platform, entry.console, patch)}
            onRemove={() => requestRemoval(entry)}
          />
        )
      })}

      {multiConsolePlatforms.length > 0 && (
        <p className="text-xs text-gray-400">
          Com mais de um console na mesma plataforma, a importação não atualiza
          as horas deste jogo. Ajuste aqui.
        </p>
      )}

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
                aria-expanded={
                  platformAsksConsole(value) ? pickingFor === value : undefined
                }
                className="relative flex items-center gap-1 px-2 py-1 rounded-full border border-dark-border text-xs text-gray-400 transition-colors motion-reduce:transition-none hover:text-gray-300 hover:border-primary/40 after:absolute after:-inset-x-0.5 after:-inset-y-2.5 after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-50"
              >
                <Plus className="size-3" aria-hidden />
                <Icon className="size-3" aria-hidden />
                {label}
              </button>
            ))}
          </div>
          {pickingFor && (
            <ConsolePicker
              key={pickingFor}
              platform={pickingFor}
              platformLabel={getLibraryPlatform(pickingFor)?.label ?? ''}
              released={releasedConsoles}
              taken={platforms
                .filter(p => p.platform === pickingFor)
                .map(p => p.console)}
              disabled={disabled}
              onCancel={() => setPickingFor(null)}
              onConfirm={value => addWithConsole(pickingFor, value)}
            />
          )}
        </fieldset>
      )}

      <ConfirmDialog
        open={pendingRemoval !== null}
        onOpenChange={open => !open && setPendingRemoval(null)}
        title={`Remover ${pendingLabel}`}
        description={
          pendingRemoval && hasPlatformData(pendingRemoval)
            ? `As horas, vezes zerado e data de finalização registradas em ${pendingLabel} serão apagadas deste jogo.`
            : `${pendingLabel} será removido deste jogo. Ainda não há horas, zeradas nem data nele.`
        }
        confirmLabel="Remover"
        onConfirm={confirmRemoval}
        isLoading={disabled}
      />
    </div>
  )
}
