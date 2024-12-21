import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import type { z } from 'zod'

import { RxCross2 } from 'react-icons/rx'
import { TbCameraPlus } from 'react-icons/tb'
import userProfilePictureDefault from '../../assets/Default_pfp.svg.png'

import { updateProfileSchema } from '../../schemas/profileSchema'

import { toast } from 'react-toastify'
import { useApi } from '../../hooks/useApi'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { UserProfileResponse } from '../../types/user'
import { useAuth } from '../../hooks/useAuth'

type UserGamesFormProps = {
  afterSave: () => void
}

export function UserProfileForm({ afterSave }: UserGamesFormProps) {
  const baseApi = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const [profilePicturePreview, setProfilePicturePreview] = useState('')
  const [userBannerPreview, setUserBannerPreview] = useState('')
  const [removeUserBanner, setRemoveUserBanner] = useState(false)

  type profileForm = z.infer<typeof updateProfileSchema>

  const {
    register: registerUpdateProfile,
    setValue,

    handleSubmit,
    formState: { errors: errosUpdateProfile },
  } = useForm<profileForm>({
    resolver: zodResolver(updateProfileSchema),
  })

  const { data: UserProfileResponse } = useQuery<UserProfileResponse>({
    queryKey: ['userProfile', userId],
    queryFn: async () => baseApi.getUserProfile(userId),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (UserProfileResponse?.user.userBanner) {
      setRemoveUserBanner(true)
    }
  }, [UserProfileResponse?.user.userBanner])

  const { mutateAsync: updateUserProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async (data: {
        userName?: string
        profilePicture?: File
        userBanner?: File
      }) => {
        let profilePictureUrl: string | undefined
        let userBannerUrl: string | null

        // Upload profile picture if provided
        if (data.profilePicture) {
          profilePictureUrl = await uploadImage(data.profilePicture)
        }

        if (!removeUserBanner) {
          userBannerUrl = null
        }

        // Upload user banner if provided
        if (data.userBanner) {
          userBannerUrl = await uploadImage(data.userBanner)
        }

        // Call the updateUser function with the updated data
        return new Promise(resolve =>
          setTimeout(
            () =>
              resolve(
                baseApi.updateUser(
                  userId,
                  data.userName,
                  profilePictureUrl,
                  userBannerUrl || ''
                )
              ),
            1000
          )
        )
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['userProfile', userId],
        })
        toast.success('User profile updated successfully 👌')
        afterSave()
      },
      onError: error => {
        toast.error(
          `Update game error: ${error instanceof Error ? error.message : 'Unknown error'} 🤯`
        )
      },
    })

  async function profileHandleSubmit(data: FieldValues) {
    if (!data) return

    updateUserProfile(data)
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'images_preset')

    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dtdkzusmw/image/upload',
      formData
    )

    return response.data.secure_url
  }

  // async function uploadProfilePicture(data: FieldValues) {
  //   if (!data.profilePicture) return

  //   setProfilePicturePreview(URL.createObjectURL(data.profilePicture))

  //   try {
  //     const image = new FormData()
  //     image.append('file', data.profilePicture)
  //     image.append('cloud_name', 'dtdkzusmw')
  //     image.append('upload_preset', 'images_preset')

  //     const cloudName = 'dtdkzusmw'
  //     const resourceType = 'image'
  //     const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

  //     const res = await axios.post(api, image)
  //     const { secure_url } = res.data
  //     const profilePicture = secure_url
  //     setIsLoading(false)
  //     await toast.promise(
  //       new Promise(resolve =>
  //         setTimeout(
  //           () =>
  //             resolve(baseApi.updateUser(userId, undefined, profilePicture)),
  //           1000
  //         )
  //       ),
  //       {
  //         pending: 'Updating...',
  //         success: 'Profile picture updated with sucess.👌',
  //         error: 'Update error 🤯',
  //       }
  //     )
  //     afterSave()
  //   } catch (error) {
  //     console.log(error)
  //     setIsLoading(false)
  //   }
  // }

  // async function uploadUserBanner(data: FieldValues) {
  //   if (!data.userBanner) return

  //   setUserBannerPreview(URL.createObjectURL(data.userBanner))

  //   try {
  //     const image = new FormData()
  //     image.append('file', data.userBanner)
  //     image.append('cloud_name', 'dtdkzusmw')
  //     image.append('upload_preset', 'images_preset')

  //     const cloudName = 'dtdkzusmw'
  //     const resourceType = 'image'
  //     const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

  //     const res = await axios.post(api, image)
  //     const { secure_url } = res.data
  //     const userBanner = secure_url
  //     setIsLoading(false)
  //     await toast.promise(
  //       new Promise(resolve =>
  //         setTimeout(
  //           () =>
  //             resolve(
  //               baseApi.updateUser(userId, undefined, undefined, userBanner)
  //             ),
  //           1000
  //         )
  //       ),
  //       {
  //         pending: 'Updating...',
  //         success: 'Banner updated with sucess.👌',
  //         error: 'Update error 🤯',
  //       }
  //     )
  //     afterSave()
  //   } catch (error) {
  //     console.log(error)
  //     setIsLoading(false)
  //   }
  // }

  // async function updateUserName(data: FieldValues) {
  //   if (data.userName && data.userName === UserProfileResponse?.user?.userName)
  //     return

  //   try {
  //     await toast.promise(
  //       new Promise(resolve =>
  //         setTimeout(
  //           () => resolve(baseApi.updateUser(userId, data.userName)),
  //           1000
  //         )
  //       ),
  //       {
  //         pending: 'Updating...',
  //         success: 'Username updated with sucess.👌',
  //         error: 'Update error 🤯',
  //       }
  //     )
  //     setIsLoading(false)
  //     afterSave()
  //   } catch (error) {
  //     console.log(error)
  //     setIsLoading(false)
  //   }
  // }

  // async function updateUserBanner() {
  //   if (
  //     userBannerPreview === '' &&
  //     (UserProfileResponse?.user.userBanner === '' ||
  //       UserProfileResponse?.user?.userBanner === null)
  //   )
  //     return

  //   await toast.promise(
  //     new Promise(resolve =>
  //       setTimeout(
  //         () => resolve(baseApi.updateUser(userId, undefined, undefined, '')),
  //         1000
  //       )
  //     ),
  //     {
  //       pending: 'Updating...',
  //       success: 'Banner updated with sucess.👌',
  //       error: 'Update error 🤯',
  //     }
  //   )
  //   setIsLoading(false)
  //   afterSave()
  // }

  const handleProfilePicture = (e: FieldValues) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePicturePreview(URL.createObjectURL(file))
    }
  }

  const handleUserBanner = (e: FieldValues) => {
    const file = e.target.files[0]
    if (file) {
      setUserBannerPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveBanner = () => {
    if (userBannerPreview) {
      setUserBannerPreview('')
      setValue('userBanner', null)
      return
    }

    setRemoveUserBanner(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(profileHandleSubmit)}>
        <div className="flex flex-row items-center bg-[#272932] rounded-md w-[650px] h-[260px]">
          {!userBannerPreview && !removeUserBanner && (
            <div className="flex items-center justify-center w-[650px] h-[200px]">
              <label htmlFor="userBanner">
                <input
                  id="userBanner"
                  type="file"
                  accept="image/*"
                  className="fixed -top-[100em]"
                  style={{ position: 'fixed', top: '-100em' }}
                  {...registerUpdateProfile('userBanner', {
                    onChange: e => {
                      handleUserBanner(e)
                    },
                  })}
                />
                <div className="rounded-full bg-black opacity-60 w-10 h-10  flex items-center justify-center hover:bg-black hover:brightness-150 hover:opacity-45 hover:cursor-pointer delay-100">
                  <TbCameraPlus className="size-6 text-[#d0cac7]" />
                </div>
              </label>
            </div>
          )}
          {(userBannerPreview || removeUserBanner) && (
            <div>
              <img
                src={userBannerPreview || UserProfileResponse?.user?.userBanner}
                alt=""
                className="rounded w-[650px] h-[200px] opacity-65"
              />
              <label htmlFor="userBanner">
                <input
                  id="userBanner"
                  type="file"
                  accept="image/*"
                  style={{ position: 'fixed', top: '-100em' }}
                  {...registerUpdateProfile('userBanner', {
                    onChange: e => {
                      handleUserBanner(e)
                    },
                  })}
                />
                <div className="rounded-full bg-black opacity-60 w-10 h-10 absolute left-[330px] top-[130px] flex items-center justify-center hover:bg-black hover:brightness-150 hover:opacity-45 hover:cursor-pointer delay-100">
                  <TbCameraPlus className="size-6 text-[#d0cac7]" />
                </div>
              </label>
              <button
                type="button"
                className="rounded-full bg-black opacity-60 w-10 h-10 absolute left-[385px] top-[130px] flex items-center justify-center hover:bg-black hover:brightness-150 hover:opacity-45 hover:cursor-pointer delay-100"
                onClick={handleRemoveBanner}
              >
                <RxCross2 className="size-6 text-[#d0cac7]" />
              </button>
            </div>
          )}

          <div className="absolute top-[200px] left-[17%] transform -translate-x-1/2 size-28 bg-[#272932] rounded-full flex items-center justify-center">
            <img
              src={
                profilePicturePreview ||
                (UserProfileResponse?.user?.profilePicture === null
                  ? userProfilePictureDefault
                  : UserProfileResponse?.user?.profilePicture)
              }
              alt=""
              className="size-24 rounded-full"
            />
            <label htmlFor="profilePicture">
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                style={{ position: 'fixed', top: '-100em' }}
                {...registerUpdateProfile('profilePicture', {
                  onChange: e => {
                    handleProfilePicture(e)
                  },
                })}
              />
              <div className="rounded-full bg-black opacity-60 w-10 h-10 absolute left-[35px] top-[40px] flex items-center justify-center hover:bg-black hover:brightness-150 hover:opacity-45 hover:cursor-pointer delay-100">
                <TbCameraPlus className="size-6 text-white" />
              </div>
              {errosUpdateProfile.profilePicture && (
                <span className="text-red-600">
                  {errosUpdateProfile.profilePicture.message}
                </span>
              )}
            </label>
          </div>
        </div>
        <div className="w-full flex justify-end px-4 h-10">
          {isUpdatingProfile ? (
            'Uploading...'
          ) : (
            <button
              type="submit"
              className="p-2 rounded-2xl bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105
              hover:from-[#5D23A5] hover:to-[#813FCF]
               text-white font-semibold w-24"
            >
              Save
            </button>
          )}
        </div>
        <div className="flex justify-start w-full pb-4">
          <label htmlFor="userName">
            <p className="mb-2 text-[#bcb3b3]">Username</p>
            <input
              type="text"
              className="bg-[#1A1C26] text-[#8F8F8F] rounded-lg block p-2.5 pl-10"
              defaultValue={UserProfileResponse?.user?.userName}
              {...registerUpdateProfile('userName')}
            />
            {errosUpdateProfile.userName && (
              <span className="text-red-600 font-semibold">
                {errosUpdateProfile.userName.message}
              </span>
            )}
          </label>
        </div>
      </form>
    </>
  )
}
