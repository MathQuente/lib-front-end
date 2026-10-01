import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { ImportStatusResponse } from '../types/import'
import { getErrorMessage } from '../utils/getErrorMessage'
import { useAuth } from './useAuth'

const POLLING_STATUSES = ['waiting', 'active', 'delayed']

export interface PlatformImportConfig<TResult> {
  key: string
  label: string
  getStatus: () => Promise<ImportStatusResponse<TResult>>
  connect: (input: string) => Promise<unknown>
  disconnect: () => Promise<unknown>
  startImport: () => Promise<unknown>
}

export const usePlatformImport = <TResult>(
  config: PlatformImportConfig<TResult>
) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const queryKey = [`${config.key}ImportStatus`, userId]

  const { data: status, isLoading } = useQuery<ImportStatusResponse<TResult>>({
    queryKey,
    queryFn: () => config.getStatus(),
    enabled: Boolean(userId),
    refetchInterval: query =>
      POLLING_STATUSES.includes(query.state.data?.status ?? '') ? 1000 : false,
    refetchIntervalInBackground: true,
  })

  const connect = useMutation({
    mutationFn: (input: string) => config.connect(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      toast.success(`${config.label} conectada com sucesso 👌`)
    },
    onError: error => {
      toast.error(getErrorMessage(error, `Erro ao conectar ${config.label}`))
    },
  })

  const disconnect = useMutation({
    mutationFn: () => config.disconnect(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      toast.success(`${config.label} desconectada`)
    },
    onError: error => {
      toast.error(getErrorMessage(error, `Erro ao desconectar ${config.label}`))
    },
  })

  const startImport = useMutation({
    mutationFn: () => config.startImport(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
    onError: error => {
      toast.error(getErrorMessage(error, 'Erro ao iniciar a importação'))
    },
  })

  const refreshAfterImport = () => {
    queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
    queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
    queryClient.invalidateQueries({ queryKey: ['games'] })
    queryClient.invalidateQueries({ queryKey: ['gamePlatforms', userId] })
  }

  return {
    status,
    isLoadingStatus: isLoading,
    connect: (input: string) => connect.mutateAsync(input),
    isConnecting: connect.isPending,
    disconnect: () => disconnect.mutateAsync(),
    isDisconnecting: disconnect.isPending,
    startImport: () => startImport.mutateAsync(),
    isStarting: startImport.isPending,
    refreshAfterImport,
  }
}

export type PlatformImport<TResult> = ReturnType<
  typeof usePlatformImport<TResult>
>
