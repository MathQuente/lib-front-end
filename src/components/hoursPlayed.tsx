import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { useHoursPlayed } from '../hooks/useHoursPlayed'
import type { GameCardData } from '../types/games'

const MAX_HOURS = 9999.99

function stripLeadingZeros(raw: string) {
  return raw.replace(/^0+(?=\d)/, '')
}

export function HoursPlayed({ game }: { game: GameCardData }) {
  const { hoursPlayed, updateHoursPlayed, isLoading } = useHoursPlayed(
    game.igdbId.toString()
  )

  const [value, setValue] = useState(hoursPlayed.toString())

  useEffect(() => {
    setValue(hoursPlayed.toString())
  }, [hoursPlayed])

  const parsed = Number(value)
  const isValid =
    value.trim() !== '' && !Number.isNaN(parsed) && parsed >= 0 && parsed <= MAX_HOURS
  const isDirty = isValid && parsed !== hoursPlayed

  async function handleSave() {
    if (!isDirty) return
    await updateHoursPlayed(parsed)
  }

  return (
    <div className="flex items-center justify-end gap-2 w-full px-3 py-2 rounded-lg bg-dark-bg-lighter">
      <span className="flex items-center gap-1.5 text-xs text-gray-400">
        <Clock className="size-3.5 text-primary" aria-hidden="true" />
        Horas jogadas
      </span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={MAX_HOURS}
          step="any"
          value={value}
          onChange={e => setValue(stripLeadingZeros(e.target.value))}
          disabled={isLoading}
          aria-label="Horas jogadas"
          aria-invalid={!isValid}
          className="w-16 rounded-md bg-dark-bg px-2 py-1 text-sm text-white text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isLoading}
          className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors text-primary hover:bg-dark-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Salvar
        </button>
      </div>
    </div>
  )
}
