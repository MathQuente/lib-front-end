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
      return file
    }

    if (file instanceof File) {
      return await api.uploadFile(file)
    }

    return null
  }

  const updateUserProfile = useMutation({
    mutationFn: async (data: UpdateUserProfileData) => {
      let profilePictureUrl: string | undefined
      let userBannerUrl: string | null | undefined

      if (data.profilePicture) {
        const uploadedUrl = await uploadImageIfNeeded(data.profilePicture)
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl
        }
      }

      if (options?.removeUserBanner) {
        console.log('remove banner')
        userBannerUrl = null
      } else if (data.userBanner) {
        userBannerUrl = await uploadImageIfNeeded(data.userBanner)
      } else {
        userBannerUrl = undefined
      }

      const updatePayload: {
        userName?: string
        profilePicture?: string
        userBanner?: string | null
      } = {}

      if (data.userName !== undefined) {
        updatePayload.userName = data.userName
      }

      if (profilePictureUrl !== undefined) {
        updatePayload.profilePicture = profilePictureUrl
      }

      if (userBannerUrl !== undefined) {
        updatePayload.userBanner = userBannerUrl
      }

      return api.updateUser({
        userName: data.userName,
        profilePicture: profilePictureUrl,
        userBanner: userBannerUrl
      })
    },
    onMutate: async newData => {
      await queryClient.cancelQueries({ queryKey })

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
