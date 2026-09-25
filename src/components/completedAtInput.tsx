import { useEffect, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import { useCompletedAt } from '../hooks/useCompletedAt'
import type { GameCardData } from '../types/games'

const today = () => new Date().toISOString().slice(0, 10)

export function CompletedAtInput({ game }: { game: GameCardData }) {
  const { completedAt, updateCompletedAt, isLoading } = useCompletedAt(
    game.igdbId.toString()
  )

  const [value, setValue] = useState(completedAt ?? '')

  useEffect(() => {
    setValue(completedAt ?? '')
  }, [completedAt])

  const isValid = value.trim() !== '' && value <= today()
  const isDirty = isValid && value !== completedAt

  async function handleSave() {
    if (!isDirty) return
    await updateCompletedAt(value)
  }

  return (
    <div className="flex items-center justify-end gap-2 w-full px-3 py-2 rounded-lg bg-dark-bg-lighter">
      <span className="flex items-center gap-1.5 text-xs text-gray-400">
        <CalendarCheck className="size-3.5 text-primary" aria-hidden="true" />
        Data de finalização
      </span>
      <div className="flex items-center gap-2">
        <input
          type="date"
          max={today()}
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={isLoading}
          aria-label="Data de finalização"
          aria-invalid={!isValid}
          className="rounded-md bg-dark-bg px-2 py-1 text-sm text-white outline-none ring-2 ring-offset-1 ring-offset-dark-bg ring-transparent focus-visible:ring-primary-light disabled:opacity-50"
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
