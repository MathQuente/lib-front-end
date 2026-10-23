import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type {
  LibraryPlatform,
  PlatformConsole,
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
    mutationFn: ({
      platform,
      gameConsole,
    }: {
      platform: LibraryPlatform
      gameConsole: PlatformConsole
    }) => api.addGamePlatform(igdbId, platform, gameConsole),
    onSuccess: onChanged,
    onError: onError('Erro ao adicionar plataforma.'),
  })

  const updatePlatform = useMutation({
    mutationFn: ({
      platform,
      gameConsole,
      patch,
    }: {
      platform: LibraryPlatform
      gameConsole: PlatformConsole
      patch: UserGamePlatformPatch
    }) => api.updateGamePlatform(igdbId, platform, gameConsole, patch),
    onSuccess: onChanged,
    onError: onError('Erro ao atualizar plataforma.'),
  })

  const removePlatform = useMutation({
    mutationFn: ({
      platform,
      gameConsole,
    }: {
      platform: LibraryPlatform
      gameConsole: PlatformConsole
    }) => api.removeGamePlatform(igdbId, platform, gameConsole),
    onSuccess: onChanged,
    onError: onError('Erro ao remover plataforma.'),
  })

  return {
    platforms: data?.platforms ?? [],
    totals: data?.totals,
    isLoading,
    addPlatform: (platform: LibraryPlatform, gameConsole: PlatformConsole) =>
      addPlatform.mutateAsync({ platform, gameConsole }),
    updatePlatform: (
      platform: LibraryPlatform,
      gameConsole: PlatformConsole,
      patch: UserGamePlatformPatch
    ) => updatePlatform.mutateAsync({ platform, gameConsole, patch }),
    removePlatform: (platform: LibraryPlatform, gameConsole: PlatformConsole) =>
      removePlatform.mutateAsync({ platform, gameConsole }),
    isMutating:
      addPlatform.isPending ||
      updatePlatform.isPending ||
      removePlatform.isPending,
  }
}
