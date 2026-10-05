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
  redirectsAway?: boolean
  requestVerification?: (input: string) => Promise<{ code: string }>
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

  const {
    data: status,
    isLoading,
    refetch,
  } = useQuery<ImportStatusResponse<TResult>>({
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
      if (config.redirectsAway) return
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      toast.success(`${config.label} conectada com sucesso 👌`)
    },
    onError: error => {
      toast.error(getErrorMessage(error, `Erro ao conectar ${config.label}`))
    },
  })

  const requestVerification = useMutation({
    mutationFn: (input: string) => {
      if (!config.requestVerification) {
        throw new Error('This platform has no verification step')
      }
      return config.requestVerification(input)
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
    refetchStatus: () => refetch().then(result => result.data),
    connect: (input = '') => connect.mutateAsync(input),
    isConnecting: connect.isPending,
    redirectsAway: Boolean(config.redirectsAway),
    requestVerification: config.requestVerification
      ? (input: string) => requestVerification.mutateAsync(input)
      : undefined,
    isRequestingVerification: requestVerification.isPending,
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
