import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { GameStatsResponse } from '../types/user'
import { useApi } from '../hooks/useApi'
import { UseAuth } from '../contexts/auth/authContext'
import type { GameDlcBase } from '../types/games'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IconButton } from './iconButton'

export function PlayedCount({
  item,
  isPlayed,
}: {
  item: GameDlcBase | undefined
  isPlayed: boolean
}) {
  const api = useApi()
  const { user } = UseAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const [completionCount, setCompletionCount] = useState(1)
  const [showCompletionCounter, setShowCompletionCounter] = useState(false)

  const { data: completionsData } = useQuery<GameStatsResponse>({
    queryKey: ['gameStats', userId, item?.id],
    queryFn: async () => api.getGameStats(userId, item?.id),
    enabled: !!item?.id,
  })

  useEffect(() => {
    if (isPlayed) {
      // Set completion count from the GameStatsResponse data directly
      if (completionsData?.UserGameStats?.completions !== undefined) {
        setCompletionCount(completionsData.UserGameStats.completions)
      }

      // Show counter automatically if played
      setShowCompletionCounter(true)
    } else {
      // Hide counter when not played
      setShowCompletionCounter(false)
    }
  }, [completionsData, isPlayed])

  const { mutateAsync: updateCompletionCountFn } = useMutation({
    mutationFn: (data: {
      userId: string | null
      gameId: string | undefined
      incrementValue: number
    }) => {
      return api.updateCompletionCount(
        data.userId,
        data.gameId,
        data.incrementValue
      )
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['gamesStatus', variables.userId, variables.gameId],
      })
      toast.success('Contagem de finalizações atualizada com sucesso 👌')
    },
    onError: error => {
      toast.error(
        `Erro ao atualizar contagem: ${error instanceof Error ? error.message : 'Erro desconhecido'} 🤯`
      )
    },
  })

  // Increment the completion count
  const incrementCompletionCount = async () => {
    const newCount = completionCount + 1
    setCompletionCount(newCount)
    await updateCompletionCountFn({
      userId,
      gameId: item?.id,
      incrementValue: 1,
    })
  }

  // Decrement the completion count (minimum 1)
  const decrementCompletionCount = async () => {
    if (completionCount > 1) {
      const newCount = completionCount - 1
      setCompletionCount(newCount)

      await updateCompletionCountFn({
        userId,
        gameId: item?.id,
        incrementValue: -1,
      })
    }
  }

  // Manually update the completion count
  const handleCompletionCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number.parseInt(e.target.value, 10)
    if (!Number.isNaN(value) && value >= 1) {
      setCompletionCount(value)
    }
  }

  const handleCompletionCountBlur = async () => {
    await updateCompletionCountFn({
      userId,
      gameId: item?.id,
      incrementValue: 0,
    })
  }

  // Only show the counter if the game is marked as played
  if (!isPlayed || !showCompletionCounter) {
    return (
      <>
        {isPlayed && (
          <button
            type="button"
            onClick={() => setShowCompletionCounter(true)}
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
          onChange={handleCompletionCountChange}
          onBlur={handleCompletionCountBlur}
          className="w-8 text-center bg-gray-700 border-0 text-white"
        />
        <IconButton onClick={incrementCompletionCount}>
          <ArrowUp className="size-5 text-[#6930CD]" />
        </IconButton>
      </div>
    </div>
  )
}
