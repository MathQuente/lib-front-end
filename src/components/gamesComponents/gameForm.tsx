import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FormEvent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiPause } from 'react-icons/fi'
import { IoMdHourglass } from 'react-icons/io'
import { PiFlagCheckeredBold } from 'react-icons/pi'
import { SlOptionsVertical } from 'react-icons/sl'
import { toast } from 'react-toastify'
import { useApi } from '../../hooks/useApi'
import type { Game } from '../../types/games'
import type { GameStatusResponse } from '../../types/games'
import { GameModal } from './gameModal'

interface FormValues {
  statusId: string | undefined
}

export function GameForm({
  afterSave,
  game,
}: {
  afterSave: () => void
  game: Game
}) {
  const api = useApi()
  const userId = api.getUserIdFromToken()
  const queryClient = useQueryClient()

  const { data: GameStatus } = useQuery<GameStatusResponse>({
    queryKey: ['gamesStatus', userId, game?.id],
    queryFn: async () => api.getGameStatus(userId, game?.id),
    enabled: !!game?.id,
  })

  const { mutateAsync: addGameFn, isPending: isAddingGame } = useMutation({
    mutationFn: (data: {
      userId: string | null
      gameId: string | undefined
      statusId: string | undefined
    }) => api.addGame(data.userId, data.gameId, data.statusId),
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

  const { mutateAsync: updateGameStatusFn, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: (data: {
        userId: string | null
        gameId: string | undefined
        statusId: string | null | undefined
      }) => api.updateGameStatus(data.userId, data.gameId, data.statusId),
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
      queryClient.setQueryData(['games'], (old: Game[] | undefined) =>
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

  const { handleSubmit, control, watch, setValue, trigger } =
    useForm<FormValues>({
      values: { statusId: GameStatus?.id.toString() },
    })

  const gameStatus = watch('statusId')

  if (!game) {
    return null
  }

  async function handleAddGame(
    data: FormValues,
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    if (!data.statusId) {
      toast.warning('Select some status')
      return null
    }

    if (!GameStatus) {
      await addGameFn({ userId, gameId: game?.id, statusId: data.statusId })
      afterSave()
      return
    }

    await updateGameStatusFn({
      userId,
      gameId: game?.id,
      statusId: data.statusId,
    })
    afterSave()
  }

  async function handleSubmitRemoveGame() {
    await removeGameFn({ userId, gameId: game?.id })
    afterSave()
  }

  return (
    <form
      onSubmit={handleSubmit((data, event) =>
        handleAddGame(data, event as FormEvent<HTMLFormElement>)
      )}
      className="flex flex-col justify-center"
    >
      <div className="flex flex-row justify-center gap-2 h-[90px]">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="rounded-2xl w-48 h-10 flex flex-row items-center justify-center gap-2 text-white 
      bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105 hover:from-[#5D23A5] hover:to-[#813FCF] 
      text-lg font-bold"
              aria-label="Customise options"
            >
              {gameStatus === '1' && <PiFlagCheckeredBold className="size-4" />}
              {gameStatus === '2' && <IoMdHourglass className="size-4" />}
              {gameStatus === '3' && <FiPause className="size-4" />}
              <p>
                {gameStatus === '1'
                  ? 'Finished'
                  : gameStatus === '2'
                    ? 'Playing'
                    : gameStatus === '3'
                      ? 'Paused'
                      : 'Selecione um status'}
              </p>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="w-36 flex flex-col items-center justify-center bg-white rounded-2xl p-[5px]
       will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade"
              sideOffset={5}
            >
              <Controller
                name="statusId"
                control={control}
                render={({ field }) => (
                  <DropdownMenu.RadioGroup
                    value={field.value} // Controla o valor do RadioGroup
                    onValueChange={value => {
                      // Atualiza o valor no formulário e força uma validação
                      setValue('statusId', value)
                      trigger('statusId') // Isso força o react-hook-form a atualizar o valor
                      field.onChange(value) // Chama o onChange para sincronizar o valor
                    }}
                    className="flex flex-col items-center justify-center w-full"
                  >
                    <DropdownMenu.RadioItem
                      value="1"
                      className="flex items-center gap-4 w-full justify-center py-1
               hover:bg-gray-100 text-violet-600 cursor-pointer"
                    >
                      <PiFlagCheckeredBold className="size-4" />
                      Finished
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem
                      value="2"
                      className="flex items-center gap-4 w-full justify-center py-1 hover:bg-gray-100 cursor-pointer 
              text-violet-600"
                    >
                      <IoMdHourglass className="size-4" />
                      Playing
                    </DropdownMenu.RadioItem>
                    <DropdownMenu.RadioItem
                      value="3"
                      className="flex items-center gap-4 w-full justify-center py-1 hover:bg-gray-100 cursor-pointer 
              text-violet-600"
                    >
                      <FiPause className="size-4" />
                      Paused
                    </DropdownMenu.RadioItem>
                  </DropdownMenu.RadioGroup>
                )}
              />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {GameStatus && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className="rounded-xl w-12 h-10 flex items-center justify-center text-white 
            bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105 hover:from-[#5D23A5] hover:to-[#813FCF]"
            >
              <SlOptionsVertical />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="bg-red-600 rounded-md p-2 m-1  will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade 
            data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade 
            data-[side=left]:animate-slideRightAndFade hover:bg-red-700"
            >
              <button
                type="button"
                className="text-sm font-semibold text-white rounded-2xl flex flex-row items-center justify-center gap-1 w-full h-6 
               select-none data-[highlighted]:bg-slate-700"
                onClick={() => {
                  handleSubmitRemoveGame()
                }}
              >
                Remover de{' '}
                {GameStatus.id.toString() === '3' && (
                  <FiPause className="size-4" />
                )}
                {GameStatus.id.toString() === '1'
                  ? 'finished'
                  : GameStatus.id.toString() === '2'
                    ? 'playing'
                    : 'paused'}
              </button>
              <DropdownMenu.Arrow className="fill-red-600" />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </div>

      <div className="flex justify-end">
        <GameModal.Close className="rounded px-4 text-sm font-medium text-gray-500 hover:text-gray-600">
          Cancel
        </GameModal.Close>
        <button
          type="submit"
          className="flex items-center justify-center rounded-2xl bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105 hover:from-[#5D23A5] hover:to-[#813FCF]  px-4 py-2 text-sm font-medium text-white group-disabled:pointer-events-none"
          disabled={isAddingGame || isUpdatingStatus}
        >
          <span className="group-disabled:opacity-0">
            {isAddingGame || isUpdatingStatus ? 'Saving...' : 'Save'}
          </span>
        </button>
      </div>
    </form>
  )
}
