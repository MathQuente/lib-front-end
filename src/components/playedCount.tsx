import type { Game } from '../types/games'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { IconButton } from './iconButton'
import { usePlayedCount } from '../hooks/usePlayedCount'

export function PlayedCount({
  game,
  isPlayed,
}: {
  game: Game
  isPlayed: boolean
}) {
  const { completions, updatePlayedCount } = usePlayedCount(game.id, isPlayed)

  const completionCount = Math.max(completions ?? 0, 1)

  // Increment the completion count
  const incrementCompletionCount = async () => {
    await updatePlayedCount(1)
  }

  // Decrement the completion count (minimum 1)
  const decrementCompletionCount = async () => {
    if (completionCount > 1) {
      await updatePlayedCount(-1)
    }
  }

  // Manually update the completion count

  const handleCompletionCountBlur = async () => {
    await updatePlayedCount(1)
  }

  // Only show the counter if the game is marked as played
  if (!isPlayed || !completionCount) {
    return (
      <>
        {isPlayed && (
          <button
            type="button"
            className="mt-2 px-2 py-1 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded"
          >
            Show completion count
          </button>
        )}
      </>
    )
  }

  return (
    <div className="flex justify-center items-center bg-gray-800 rounded h-12 w-full">
      <span className="text-gray-300">Times completed:</span>
      <div className="flex items-center">
        <IconButton
          onClick={decrementCompletionCount}
          disabled={completionCount <= 1}
        >
          <ArrowDown
            className={`size-5 ${completionCount <= 1 ? 'text-black' : 'text-[#6930CD]'}`}
          />
        </IconButton>
        <input
          disabled
          value={completionCount}
          onBlur={handleCompletionCountBlur}
          className="w-8 text-center bg-gray-700 border-0 text-white"
          readOnly
        />
        <IconButton onClick={incrementCompletionCount}>
          <ArrowUp className="size-5 text-[#6930CD]" />
        </IconButton>
      </div>
    </div>
  )
}
