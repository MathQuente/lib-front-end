import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { api } from './useApi'
import type { GameHoursResponse } from '../types/user'
import { toast } from 'react-toastify'
import { useGameStatus } from './useGameStatus'
import { USER_GAME_STATUS_ID as STATUS } from '../constants/gameStatus'

const getGameHoursQueryKey = (userId: string, igdbId: string) => [
  'gameHours',
  userId,
  igdbId
]

export const useHoursPlayed = (igdbId: string) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const { gameStatus } = useGameStatus(igdbId)
  const isWishlist = gameStatus?.userGameStatus?.id === STATUS.WISHLIST

  const queryKey = getGameHoursQueryKey(userId, igdbId)

  const { data: hoursData } = useQuery<GameHoursResponse>({
    queryKey,
    queryFn: () => api.getGameHours(igdbId),
    enabled: Boolean(igdbId && userId && !isWishlist),
    staleTime: 1000 * 60 * 5
  })

  const updateHoursPlayed = useMutation({
    mutationFn: (hoursPlayed: number) => api.updateHoursPlayed(igdbId, hoursPlayed),
    onMutate: async hoursPlayed => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<GameHoursResponse>(queryKey)
      queryClient.setQueryData<GameHoursResponse>(queryKey, { hoursPlayed })

      return { previousData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['gamesInfinite'] })
      queryClient.invalidateQueries({ queryKey: ['comingSoon'] })
      queryClient.invalidateQueries({ queryKey: ['gamesFeatured'] })
      queryClient.invalidateQueries({ queryKey: ['similarGames'] })
      toast.success('Horas jogadas atualizadas com sucesso 👌')
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
      toast.error(
        `Erro ao atualizar horas jogadas: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        } 🤯`
      )
    }
  })

  return {
    hoursPlayed: hoursData?.hoursPlayed ?? 0,
    updateHoursPlayed: (hoursPlayed: number) =>
      updateHoursPlayed.mutateAsync(hoursPlayed),
    isLoading: updateHoursPlayed.isPending
  }
}
