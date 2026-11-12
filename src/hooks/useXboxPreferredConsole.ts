import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { XboxPreferredConsole } from '../types/user'
import { getErrorMessage } from '../utils/getErrorMessage'
import { api } from './useApi'
import { useAuth } from './useAuth'

export const useXboxPreferredConsole = () => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      accountId,
      preferredConsole,
    }: {
      accountId: string
      preferredConsole: XboxPreferredConsole | null
    }) => api.updateXboxPreferredConsole(accountId, preferredConsole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      toast.success('Salvo. Vale na próxima importação')
    },
    onError: error => {
      toast.error(getErrorMessage(error, 'Erro ao salvar o console do Xbox'))
    },
  })

  return { update: mutation.mutate, isUpdating: mutation.isPending }
}
