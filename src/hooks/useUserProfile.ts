import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { useApi } from './useApi'
import { useAuth } from './useAuth'
import type { UserProfileResponse } from '../types/user'
import { toast } from 'react-toastify'

interface UpdateUserProfileData {
  userName?: string
  profilePicture?: string | File
  userBanner?: string | File | null
}

interface UseUserProfileOptions {
  onUpdateSuccess?: () => void
  removeUserBanner?: boolean
}

export const useUserProfile = (options?: UseUserProfileOptions) => {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const queryKey = ['userProfile', userId]

  const {
    data: UserProfileResponse,
    isLoading,
    isError
  } = useQuery<UserProfileResponse>({
    queryKey: ['userProfile', userId],
    queryFn: async () => api.getUserProfile(userId),
    placeholderData: keepPreviousData
  })

  const uploadImageIfNeeded = async (
    file: string | File | null | undefined
  ): Promise<string | null> => {
    if (!file) return null

    if (typeof file === 'string') {
      return file // Já é uma URL
    }

    if (file instanceof File) {
      // Aqui você pode implementar sua lógica de upload
      // Por exemplo, usando Cloudinary como no seu código original
      return await api.uploadFile(file)
    }

    return null
  }

  const updateUserProfile = useMutation({
    mutationFn: async (data: UpdateUserProfileData) => {
      let profilePictureUrl: string | undefined
      let userBannerUrl: string | null = null

      if (data.profilePicture) {
        const uploadedUrl = await uploadImageIfNeeded(data.profilePicture)
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl
        }
      }

      if (options?.removeUserBanner) {
        userBannerUrl = null
      } else if (data.userBanner) {
        console.log('oi')
        userBannerUrl = await uploadImageIfNeeded(data.userBanner)
      }

      return api.updateUser({
        userName: data.userName, // ou conditional ↑
        profilePicture: profilePictureUrl, // idem, pode ser optional
        userBanner: userBannerUrl // string | null | undefined
      })
    },
    onMutate: async newData => {
      // Cancel outgoing queries para evitar conflitos
      await queryClient.cancelQueries({ queryKey })

      // Snapshot do valor anterior para rollback
      const previousProfile =
        queryClient.getQueryData<UserProfileResponse>(queryKey)

      // Optimistic update
      if (newData.userName && previousProfile) {
        queryClient.setQueryData<UserProfileResponse>(queryKey, old => {
          if (!old) return old
          return {
            ...old,
            user: {
              ...old.user,
              userName: newData.userName || old.user.userName
            }
          }
        })
      }

      return { previousProfile }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success('Perfil atualizado com sucesso 👌')
      options?.onUpdateSuccess?.()
    },
    onError: (error, _variables, context) => {
      // Rollback em caso de erro
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKey, context.previousProfile)
      }
      toast.error(
        `Erro ao atualizar perfil: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        } 🤯`
      )
    },
    onSettled: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['userProfile', userId]
      })
    }
  })

  return {
    UserProfileResponse,
    isLoading,
    isError,

    updateUserProfile: updateUserProfile.mutate,
    updateUserProfileAsync: updateUserProfile.mutateAsync,
    isUpdatingProfile: updateUserProfile.isPending,
    updateError: updateUserProfile.error
  }
}
