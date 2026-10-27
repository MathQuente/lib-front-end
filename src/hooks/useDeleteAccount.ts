import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../utils/getErrorMessage'
import { api, setAccountDeletionInProgress } from './useApi'
import { useAuth } from './useAuth'

const FALLBACK_ERROR = 'Não foi possível excluir a conta. Tente novamente.'

export function useDeleteAccount() {
  const { clearSession } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        await api.deleteAccount()
      } catch (error) {
        const alreadyGone =
          isAxiosError(error) &&
          error.response?.status === 404 &&
          typeof error.response.data?.message === 'string'
        if (!alreadyGone) throw error
        setAccountDeletionInProgress(true)
      }
    },
    onSuccess: async () => {
      await queryClient.cancelQueries()
      navigate('/', { replace: true })
      clearSession()
      queryClient.clear()
      toast.success('Sua conta foi excluída.')
    }
  })

  return {
    deleteAccount: () => mutation.mutate(),
    isDeleting: mutation.isPending,
    needsReauth:
      isAxiosError(mutation.error) &&
      mutation.error.response?.status === 403 &&
      mutation.error.response.data?.status === 'reauth_required',
    errorMessage: mutation.isError
      ? getErrorMessage(mutation.error, FALLBACK_ERROR)
      : null,
    resetError: mutation.reset
  }
}
