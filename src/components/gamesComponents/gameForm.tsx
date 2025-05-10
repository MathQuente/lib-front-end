import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import { useApi } from '../../hooks/useApi'
import type { GameDlcBase } from '../../types/games'
import type { GameStatusResponse } from '../../types/games'
import { useAuth } from '../../hooks/useAuth'
import { IoGameController, IoLibrary } from 'react-icons/io5'
import { FaGift, FaPlay } from 'react-icons/fa'
import { IoReload } from 'react-icons/io5'
import { PlayedCount } from '../playedCount'

export function GameForm({
  item,
}: {
  item: GameDlcBase | undefined
}) {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const { data: GameStatus } = useQuery<GameStatusResponse>({
    queryKey: ['gamesStatus', userId, item?.id],
    queryFn: async () => api.getGameStatus(userId, item?.id),
    enabled: !!item?.id,
  })

  const currentStatuses = GameStatus?.statuses ?? []

  const { mutateAsync: addGameFn } = useMutation({
    mutationFn: (data: {
      userId: string | null
      gameId: string | undefined
      statusIds: number[]
    }) => api.addGame(data.userId, data.gameId, data.statusIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['gamesStatus', userId, variables.gameId],
      })
      toast.success('Game added successfully 👌')
    },
    onError: error => {
      toast.error(
        `Add game error: ${error instanceof Error ? error.message : 'Unknown error'} 🤯`
      )
    },
  })

  const { mutateAsync: updateGameStatusFn } = useMutation({
    mutationFn: (data: {
      userId: string | null
      gameId: string | undefined
      statusIds: number[]
    }) => api.updateGameStatus(data.userId, data.gameId, data.statusIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['gamesStatus', userId, variables.gameId],
      })
      toast.success('Game status updated successfully 👌')
    },
    onError: error => {
      toast.error(
        `Update game error: ${error instanceof Error ? error.message : 'Unknown error'} 🤯`
      )
    },
  })

  const { mutateAsync: removeGameFn } = useMutation({
    mutationFn: (data: {
      userId: string | null
      gameId: string | undefined
    }) => api.removeGame(data.userId, data.gameId),
    onMutate: async variables => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['games'] })
      await queryClient.cancelQueries({
        queryKey: ['gamesStatus', userId, variables.gameId],
      })

      // Snapshot the previous values
      const previousGames = queryClient.getQueryData(['games'])
      const previousGameStatus = queryClient.getQueryData([
        'gamesStatus',
        userId,
        variables.gameId,
      ])

      // Optimistically update to the new value
      queryClient.setQueryData(['games'], (old: GameDlcBase[] | undefined) =>
        old ? old.filter(g => g.id !== variables.gameId) : []
      )
      queryClient.setQueryData(['gamesStatus', userId, variables.gameId], null)

      // Return a context object with the snapshotted value
      return { previousGames, previousGameStatus }
    },
    onSuccess: (_, variables) => {
      // Remove the game status from the cache
      queryClient.removeQueries({
        queryKey: ['gamesStatus', userId, variables.gameId],
      })

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['gamesStatus'] })

      toast.success('Game removed successfully 👌')
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['games'], context?.previousGames)
      queryClient.setQueryData(
        ['gamesStatus', userId, variables.gameId],
        context?.previousGameStatus
      )
      toast.error(
        `Remove game error: ${err instanceof Error ? err.message : 'Unknown error'} 🤯`
      )
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['gamesStatus'] })
    },
  })

  if (!item) {
    return null
  }

  const STATUS = {
    PLAYED: 1,
    PLAYING: 2,
    REPLAYING: 3,
    BACKLOG: 4,
    WISHLIST: 5,
  }

  const hasStatus = (statusId: number) => {
    return currentStatuses.some(status => status.id === statusId)
  }

  const isPlayed = hasStatus(STATUS.PLAYED)
  const isReplaying = hasStatus(STATUS.REPLAYING)
  const isPlaying = hasStatus(STATUS.PLAYING)

  async function handleAddGame(statusId: number) {
    const existingIds = currentStatuses.map(s => s.id)

    // === Caso REPLAYING (tratamento especial) ===
    if (statusId === STATUS.REPLAYING) {
      const hasPlayed = hasStatus(STATUS.PLAYED)
      const hasReplaying = hasStatus(STATUS.REPLAYING)

      if (hasPlayed && hasReplaying) {
        // já teve os dois: remove REPLAYING
        await updateGameStatusFn({
          userId,
          gameId: item?.id,
          statusIds: [STATUS.PLAYED],
        })
      } else if (hasPlayed) {
        // só PLAYED → adiciona REPLAYING
        await updateGameStatusFn({
          userId,
          gameId: item?.id,
          statusIds: [STATUS.PLAYED, STATUS.REPLAYING],
        })
      } else if (hasReplaying) {
        // só REPLAYING → remove tudo
        await removeGameFn({ userId, gameId: item?.id })
      } else {
        // nenhum → adiciona REPLAYING
        await addGameFn({
          userId,
          gameId: item?.id,
          statusIds: [STATUS.REPLAYING],
        })
      }
      return
    }

    // === Regra‑mãe para os demais status ===
    const isTarget = hasStatus(statusId)
    const hasAny = existingIds.length > 0

    if (isTarget) {
      // toggle off
      await removeGameFn({ userId, gameId: item?.id })
    } else if (hasAny) {
      // já existe outro: substitui
      await updateGameStatusFn({
        userId,
        gameId: item?.id,
        statusIds: [statusId],
      })
    } else {
      // não existe nenhum: adiciona
      await addGameFn({
        userId,
        gameId: item?.id,
        statusIds: [statusId],
      })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          className="flex flex-col items-center"
          type="button"
          onClick={() => handleAddGame(STATUS.PLAYED)}
        >
          <IoGameController
            className={`size-8 ${isPlayed ? 'text-green-600' : 'text-gray-600'}`}
          />
          <p className="text-gray-400 hover:text-gray-100">Played</p>
        </button>
        {isPlayed ? (
          <button
            className="flex flex-col items-center"
            type="button"
            onClick={() => handleAddGame(STATUS.REPLAYING)}
          >
            <IoReload
              className={`size-8 ${
                isReplaying ? 'text-green-600' : 'text-gray-600'
              }`}
            />
            <p className="text-gray-400 hover:text-gray-100">Replaying</p>
          </button>
        ) : (
          <button
            className="flex flex-col items-center"
            type="button"
            onClick={() => handleAddGame(STATUS.PLAYING)}
          >
            <FaPlay
              className={`size-8 ${isPlaying ? 'text-green-600' : 'text-gray-600'}`}
            />
            <p className="text-gray-400 hover:text-gray-100">Playing</p>
          </button>
        )}
        <button
          className="flex flex-col items-center"
          type="button"
          onClick={() => handleAddGame(STATUS.BACKLOG)}
        >
          <IoLibrary
            className={`size-8 ${hasStatus(STATUS.BACKLOG) ? 'text-green-600' : 'text-gray-600'}`}
          />
          <p className="text-gray-400 hover:text-gray-100">Backlog</p>
        </button>
        <button
          className="flex flex-col items-center"
          type="button"
          onClick={() => handleAddGame(STATUS.WISHLIST)}
        >
          <FaGift
            className={`size-8 ${hasStatus(STATUS.WISHLIST) ? 'text-green-600' : 'text-gray-600'}`}
          />
          <p className="text-gray-400 hover:text-gray-100">Wishlist</p>
        </button>
      </div>
      <PlayedCount item={item} isPlayed={isPlayed} />
    </div>
  )
}
