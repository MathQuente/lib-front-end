import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import type { z } from 'zod'

import { RxCross2 } from 'react-icons/rx'
import { TbCameraPlus } from 'react-icons/tb'
import userProfilePictureDefault from '../../assets/Default_pfp.svg.png'

import { updateProfileSchema } from '../../schemas/profileSchema'

import { useUserProfile } from '../../hooks/useUserProfile'

type UserGamesFormProps = {
  afterSave: () => void
}

type profileForm = z.infer<typeof updateProfileSchema>

export function UserProfileForm({ afterSave }: UserGamesFormProps) {
  const [profilePicturePreview, setProfilePicturePreview] = useState('')
  const [userBannerPreview, setUserBannerPreview] = useState('')

  // Estado que só indica “o usuário já tem banner salvo”
  const [hasExistingBanner, setHasExistingBanner] = useState(false)
  // Estado que indica “o usuário clicou em remover”
  const [shouldRemoveBanner, setShouldRemoveBanner] = useState(false)

  const { UserProfileResponse, updateUserProfile, isUpdatingProfile } =
    useUserProfile({
      onUpdateSuccess: afterSave,
      removeUserBanner: shouldRemoveBanner,
    })

  const {
    register: registerUpdateProfile,
    setValue,
    handleSubmit,
    formState: { errors: errosUpdateProfile },
  } = useForm<profileForm>({
    resolver: zodResolver(updateProfileSchema),
  })

  useEffect(() => {
    if (UserProfileResponse?.user.userBanner) {
      setHasExistingBanner(true)
    }
  }, [UserProfileResponse?.user.userBanner])

  async function profileHandleSubmit(data: FieldValues) {
    if (!data) return

    // Preparar dados para envio
    const updateData: {
      userName?: string
      profilePicture?: File
      userBanner?: File | null
    } = {}
    if (data.userName) {
      updateData.userName = data.userName
    }

    if (data.profilePicture) {
      updateData.profilePicture = data.profilePicture
    }

    if (data.userBanner) {
      updateData.userBanner = data.userBanner
    } else if (shouldRemoveBanner) {
      updateData.userBanner = null
    }

    updateUserProfile(updateData)
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
    setShouldRemoveBanner(true)
    setHasExistingBanner(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(profileHandleSubmit)}>
        <div className="flex flex-row items-center bg-[#272932] rounded-md w-[650px] h-[260px]">
          {!userBannerPreview && (!hasExistingBanner || shouldRemoveBanner) && (
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
          {(userBannerPreview || hasExistingBanner) && (
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
                      const file = e.target.files?.[0] ?? null
                      if (file) {
                        const url = URL.createObjectURL(file)
                        setUserBannerPreview(url)
                      }
                      return file
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
                    const file = e.target.files?.[0] ?? null
                    if (file) {
                      const url = URL.createObjectURL(file)
                      setProfilePicturePreview(url)
                    }
                    return file
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
