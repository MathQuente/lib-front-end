import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type {
  LibraryPlatform,
  UserGamePlatformPatch,
  UserGamePlatformsResponse,
} from '../types/platform'
import { getErrorMessage } from '../utils/getErrorMessage'
import { api } from './useApi'
import { useAuth } from './useAuth'

export const useGamePlatforms = (igdbId: string, enabled: boolean) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const queryKey = ['gamePlatforms', userId, igdbId]

  const { data, isLoading } = useQuery<UserGamePlatformsResponse>({
    queryKey,
    queryFn: () => api.getGamePlatforms(igdbId),
    enabled: Boolean(igdbId && userId && enabled),
  })

  const onChanged = (next: UserGamePlatformsResponse) => {
    queryClient.setQueryData(queryKey, next)
    queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
    queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
    queryClient.invalidateQueries({ queryKey: ['gameHours', userId, igdbId] })
    queryClient.invalidateQueries({
      queryKey: ['gameCompletedAt', userId, igdbId],
    })
    queryClient.invalidateQueries({ queryKey: ['gameStats', userId, igdbId] })
  }

  const onError = (fallback: string) => (error: unknown) => {
    toast.error(getErrorMessage(error, fallback))
  }

  const addPlatform = useMutation({
    mutationFn: (platform: LibraryPlatform) =>
      api.addGamePlatform(igdbId, platform),
    onSuccess: onChanged,
    onError: onError('Erro ao adicionar plataforma.'),
  })

  const updatePlatform = useMutation({
    mutationFn: ({
      platform,
      patch,
    }: {
      platform: LibraryPlatform
      patch: UserGamePlatformPatch
    }) => api.updateGamePlatform(igdbId, platform, patch),
    onSuccess: onChanged,
    onError: onError('Erro ao atualizar plataforma.'),
  })

  const removePlatform = useMutation({
    mutationFn: (platform: LibraryPlatform) =>
      api.removeGamePlatform(igdbId, platform),
    onSuccess: onChanged,
    onError: onError('Erro ao remover plataforma.'),
  })

  return {
    platforms: data?.platforms ?? [],
    totals: data?.totals,
    isLoading,
    addPlatform: (platform: LibraryPlatform) =>
      addPlatform.mutateAsync(platform),
    updatePlatform: (platform: LibraryPlatform, patch: UserGamePlatformPatch) =>
      updatePlatform.mutateAsync({ platform, patch }),
    removePlatform: (platform: LibraryPlatform) =>
      removePlatform.mutateAsync(platform),
    isMutating:
      addPlatform.isPending ||
      updatePlatform.isPending ||
      removePlatform.isPending,
  }
}
