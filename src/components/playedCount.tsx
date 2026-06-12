import { Minus, Plus } from 'lucide-react'
import { usePlayedCount } from '../hooks/usePlayedCount'
import type { GameBase } from '../types/games'

export function PlayedCount({ game }: { game: GameBase }) {
  const { completions, updatePlayedCount } = usePlayedCount(game.id)

  const count = Math.max(completions ?? 0, 1)

  return (
    <div className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-dark-bg-lighter">
      <span className="text-xs text-gray-400">Vezes zerado</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updatePlayedCount(-1)}
          disabled={count <= 1}
          className="flex items-center justify-center size-6 rounded-md transition-colors text-primary hover:bg-dark-bg disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-medium text-white">{count}</span>
        <button
          type="button"
          onClick={() => updatePlayedCount(1)}
          className="flex items-center justify-center size-6 rounded-md transition-colors text-primary hover:bg-dark-bg"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
