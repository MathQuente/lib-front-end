import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './useApi'
import { useAuth } from './useAuth'
import { toast } from 'react-toastify'
import type { ImportStatusResponse } from '../types/steam'

const POLLING_STATUSES = ['waiting', 'active', 'delayed']

export const useSteamImport = () => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const queryKey = ['steamImportStatus', userId]

  const { data: status, isLoading } = useQuery<ImportStatusResponse>({
    queryKey,
    queryFn: () => api.getSteamImportStatus(),
    enabled: Boolean(userId),
    refetchInterval: query =>
      POLLING_STATUSES.includes(query.state.data?.status ?? '') ? 4000 : false
  })

  const connectSteam = useMutation({
    mutationFn: (profileInput: string) => api.connectSteam(profileInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      toast.success('Steam conectada com sucesso 👌')
    },
    onError: error => {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao conectar Steam'
      )
    }
  })

  const disconnectSteam = useMutation({
    mutationFn: () => api.disconnectSteam(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      toast.success('Steam desconectada')
    },
    onError: error => {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao desconectar Steam'
      )
    }
  })

  const startImport = useMutation({
    mutationFn: () => api.startSteamImport(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
    onError: error => {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao iniciar a importação'
      )
    }
  })

  const refreshAfterImport = () => {
    queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
    queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
    queryClient.invalidateQueries({ queryKey: ['games'] })
  }

  return {
    status,
    isLoadingStatus: isLoading,
    connectSteam: (profileInput: string) =>
      connectSteam.mutateAsync(profileInput),
    isConnecting: connectSteam.isPending,
    disconnectSteam: () => disconnectSteam.mutateAsync(),
    isDisconnecting: disconnectSteam.isPending,
    startImport: () => startImport.mutateAsync(),
    isStarting: startImport.isPending,
    refreshAfterImport
  }
}
