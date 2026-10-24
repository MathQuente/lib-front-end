import { Minus, Plus } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useCompletedAt } from '../hooks/useCompletedAt'
import { useHoursPlayed } from '../hooks/useHoursPlayed'
import { usePlayedCount } from '../hooks/usePlayedCount'
import type { GameCardData } from '../types/games'
import { inlineFieldFocus } from '../styles/focus'
import { Button } from './button'
import { IconButton } from './iconButton'

const MAX_HOURS = 9999.99

const today = () => new Date().toISOString().slice(0, 10)

function stripLeadingZeros(raw: string) {
  return raw.replace(/^0+(?=\d)/, '')
}

const inputClass = `rounded-md bg-dark-bg px-2.5 py-1.5 text-sm text-white ${inlineFieldFocus} disabled:opacity-50`

export function LibraryRecordFields({
  game,
  isPlayed,
}: {
  game: GameCardData
  isPlayed: boolean
}) {
  const igdbId = game.igdbId.toString()
  const hoursId = useId()
  const dateId = useId()

  const {
    hoursPlayed,
    updateHoursPlayed,
    isLoading: hoursLoading,
  } = useHoursPlayed(igdbId)
  const {
    completedAt,
    updateCompletedAt,
    isLoading: dateLoading,
  } = useCompletedAt(igdbId)
  const { completions, updatePlayedCount } = usePlayedCount(igdbId)

  const [hours, setHours] = useState(hoursPlayed.toString())
  const [date, setDate] = useState(completedAt ?? '')

  useEffect(() => {
    setHours(hoursPlayed.toString())
  }, [hoursPlayed])

  useEffect(() => {
    setDate(completedAt ?? '')
  }, [completedAt])

  const parsedHours = Number(hours)
  const hoursValid =
    hours.trim() !== '' &&
    !Number.isNaN(parsedHours) &&
    parsedHours >= 0 &&
    parsedHours <= MAX_HOURS
  const hoursDirty = hoursValid && parsedHours !== hoursPlayed

  const dateValid = date.trim() !== '' && date <= today()
  const dateDirty = isPlayed && dateValid && date !== completedAt

  const isDirty = hoursDirty || dateDirty
  const isBusy = hoursLoading || dateLoading
  const minimum = isPlayed ? 1 : 0
  const count = Math.max(completions ?? 0, minimum)

  async function handleSave() {
    if (hoursDirty) await updateHoursPlayed(parsedHours)
    if (dateDirty) await updateCompletedAt(date)
  }

  return (
    <div className="flex flex-col gap-2.5 w-full p-3 rounded-lg bg-dark-bg-lighter">
      <div className="flex items-center justify-between gap-3 min-h-11">
        <label htmlFor={hoursId} className="text-xs text-gray-400">
          Horas jogadas
        </label>
        <div className="flex items-center gap-2">
          <input
            id={hoursId}
            type="number"
            inputMode="decimal"
            min={0}
            max={MAX_HOURS}
            step="any"
            value={hours}
            onChange={e => setHours(stripLeadingZeros(e.target.value))}
            disabled={isBusy}
            aria-invalid={!hoursValid}
            className={`w-20 text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${inputClass}`}
          />
          <span className="text-xs text-gray-400">h</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 min-h-11">
        <span className="text-xs text-gray-400">Vezes zerado</span>
        <div className="flex items-center gap-1">
          <IconButton
            variant="bare"
            onClick={() => updatePlayedCount(-1)}
            disabled={count <= minimum}
            title="Diminuir vezes zerado"
            aria-label="Diminuir vezes zerado"
          >
            <Minus className="size-4" />
          </IconButton>
          <span className="w-6 text-center text-sm font-medium text-white tabular-nums">
            {count}
          </span>
          <IconButton
            variant="bare"
            onClick={() => updatePlayedCount(1)}
            title="Aumentar vezes zerado"
            aria-label="Aumentar vezes zerado"
          >
            <Plus className="size-4" />
          </IconButton>
        </div>
      </div>

      {isPlayed && (
        <div className="flex items-center justify-between gap-3 min-h-11">
          <label htmlFor={dateId} className="text-xs text-gray-400">
            Finalizado em
          </label>
          <input
            id={dateId}
            type="date"
            max={today()}
            value={date}
            onChange={e => setDate(e.target.value)}
            disabled={isBusy}
            aria-invalid={!dateValid}
            className={`[color-scheme:dark] ${inputClass}`}
          />
        </div>
      )}

      {isDirty && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isBusy}
          >
            Salvar
          </Button>
        </div>
      )}
    </div>
  )
}
