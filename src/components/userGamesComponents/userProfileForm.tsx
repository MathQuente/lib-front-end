import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import type { z } from 'zod'

import { RxCross2 } from 'react-icons/rx'
import { TbCameraPlus, TbUser } from 'react-icons/tb'
import userProfilePictureDefault from '../../assets/Default_pfp.svg.png'

import { updateProfileSchema } from '../../schemas/profileSchema'

import { useUserProfile } from '../../hooks/useUserProfile'
import { Button } from '../button'

type UserGamesFormProps = {
  afterSave: () => void
  onCancel?: () => void
}

type profileForm = z.infer<typeof updateProfileSchema>

export function UserProfileForm({ afterSave, onCancel }: UserGamesFormProps) {
  const [profilePicturePreview, setProfilePicturePreview] = useState('')
  const [userBannerPreview, setUserBannerPreview] = useState('')
  const [hasExistingBanner, setHasExistingBanner] = useState(false)
  const [shouldRemoveBanner, setShouldRemoveBanner] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [originalValues, setOriginalValues] = useState({
    userName: '',
    profilePicture: '',
    userBanner: ''
  })

  const { UserProfileResponse, updateUserProfile, isUpdatingProfile } =
    useUserProfile({
      onUpdateSuccess: () => {
        setHasChanges(false)
        afterSave()
      },
      removeUserBanner: shouldRemoveBanner
    })

  const {
    register: registerUpdateProfile,
    setValue,
    handleSubmit,
    watch,
    formState: { errors: errosUpdateProfile }
  } = useForm<profileForm>({
    resolver: zodResolver(updateProfileSchema)
  })

  const watchedValues = watch()

  useEffect(() => {
    if (UserProfileResponse?.user.userBanner) {
      setHasExistingBanner(true)
    }

    if (UserProfileResponse?.user) {
      const original = {
        userName: UserProfileResponse.user.userName || '',
        profilePicture: UserProfileResponse.user.profilePicture || '',
        userBanner: UserProfileResponse.user.userBanner || ''
      }
      setOriginalValues(original)
    }
  }, [UserProfileResponse?.user])

  useEffect(() => {
    if (!UserProfileResponse?.user) return

    const currentUserName = watchedValues.userName || ''
    const hasUserNameChanged = currentUserName !== originalValues.userName
    const hasProfilePictureChanged = !!profilePicturePreview
    const hasBannerChanged = !!userBannerPreview || shouldRemoveBanner

    const hasAnyChanges =
      hasUserNameChanged || hasProfilePictureChanged || hasBannerChanged

    setHasChanges(hasAnyChanges)
  }, [
    watchedValues,
    profilePicturePreview,
    userBannerPreview,
    shouldRemoveBanner,
    originalValues,
    UserProfileResponse?.user
  ])

  async function profileHandleSubmit(data: FieldValues) {
    if (!data || !hasChanges) return

    setIsSubmitting(true)

    const updateData: {
      userName?: string
      profilePicture?: File
      userBanner?: File | null
    } = {}

    if (data.userName && data.userName !== originalValues.userName) {
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

    if (Object.keys(updateData).length === 0) {
      setIsSubmitting(false)
      return
    }

    try {
      updateUserProfile(updateData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUserBanner = (e: FieldValues) => {
    const file = e.target.files[0]
    if (file) {
      setUserBannerPreview(URL.createObjectURL(file))
      setShouldRemoveBanner(false)
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

  const handleCancel = () => {
    setProfilePicturePreview('')
    setUserBannerPreview('')
    setShouldRemoveBanner(false)
    setHasExistingBanner(!!UserProfileResponse?.user.userBanner)
    setHasChanges(false)

    setValue('userName', UserProfileResponse?.user?.userName || '')
    setValue('profilePicture', null)
    setValue('userBanner', null)

    onCancel?.()
  }

  return (
    <div className="w-full max-w-xs py-4 lg:max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(profileHandleSubmit)} className="space-y-6">
        <div className="relative overflow-hidden bg-[#1a1c26] rounded-xl shadow-lg">
          {!userBannerPreview && (!hasExistingBanner || shouldRemoveBanner) && (
            <div className="flex flex-col items-center justify-center w-full h-[200px] text-center">
              <label htmlFor="userBanner" className="cursor-pointer group">
                <input
                  id="userBanner"
                  type="file"
                  accept="image/*"
                  className="fixed -top-[100em]"
                  style={{ position: 'fixed', top: '-100em' }}
                  {...registerUpdateProfile('userBanner', {
                    onChange: e => {
                      handleUserBanner(e)
                    }
                  })}
                />
                <div className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-16 h-16 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg">
                  <TbCameraPlus className="w-8 h-8 text-white" />
                </div>
              </label>
            </div>
          )}
          {(userBannerPreview || hasExistingBanner) && (
            <div className="relative w-full h-full group">
              <img
                src={userBannerPreview || UserProfileResponse?.user?.userBanner}
                alt=""
                className="rounded-2xl w-full h-[200px] "
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ position: 'fixed', top: '-100em' }}
                      {...registerUpdateProfile('userBanner', {
                        onChange: e => {
                          const file = e.target.files?.[0] ?? null
                          if (file) {
                            const url = URL.createObjectURL(file)
                            setUserBannerPreview(url)
                            setShouldRemoveBanner(false)
                          }
                          return file
                        }
                      })}
                    />
                    <div className="rounded-full bg-gradient-to-t from-[#4D23A5]/70 to-[#783FCF]/70  hover:from-[#5D23A5] hover:to-[#813FCF] backdrop-blur-sm border border-white/30 w-12 h-12 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg">
                      <TbCameraPlus className="w-6 h-6 text-white" />
                    </div>
                  </label>

                  <button
                    type="button"
                    className="rounded-full bg-red-500/80 backdrop-blur-sm border border-red-400/50 w-12 h-12 flex items-center justify-center hover:bg-red-600/90 hover:scale-110 transition-all duration-300 shadow-lg"
                    onClick={handleRemoveBanner}
                  >
                    <RxCross2 className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute top-36 left-20">
          <div className="relative">
            <div className="w-24 h-24 bg-[#272932] shadow-lg ring-4 ring-[#272932] rounded-full">
              <img
                src={
                  profilePicturePreview ||
                  (UserProfileResponse?.user?.profilePicture === null
                    ? userProfilePictureDefault
                    : UserProfileResponse?.user?.profilePicture)
                }
                alt=""
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <label
              htmlFor="profilePicture"
              className="absolute -bottom-1 -right-1 cursor-pointer group"
            >
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                className="sr-only"
                {...registerUpdateProfile('profilePicture', {
                  onChange: e => {
                    const file = e.target.files?.[0] ?? null
                    if (file) {
                      const url = URL.createObjectURL(file)
                      setProfilePicturePreview(url)
                    }
                    return file
                  }
                })}
              />
              <div className="rounded-full bg-gradient-to-t from-[#4D23A5] to-[#783FCF] p-2 hover:from-[#5D23A5] hover:to-[#813FCF] transition-all duration-300 group-hover:scale-110 shadow-lg">
                <TbCameraPlus className="w-4 h-4 text-white" />
              </div>
            </label>
          </div>

          {errosUpdateProfile.profilePicture && (
            <div className="absolute top-full mt-2 left-0">
              <span className="text-red-400 text-sm bg-red-900/20 px-2 py-1 rounded backdrop-blur-sm">
                {errosUpdateProfile.profilePicture.message}
              </span>
            </div>
          )}
        </div>

        <div className="pt-16 space-y-6">
          <div className="bg-[#272932] rounded-xl p-6 shadow-lg border border-[#3a3d4a]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="rounded-full bg-gradient-to-t from-[#4D23A5] to-[#783FCF] p-2">
                <TbUser className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[#d0cac7] font-semibold text-lg">
                Profile Information
              </h3>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="userName"
                className="block text-[#bcb3b3] font-medium"
              >
                Username
              </label>
              <input
                type="text"
                id="userName"
                className="w-full bg-[#1A1C26] text-[#d0cac7] rounded-lg px-4 py-3 border border-[#3a3d4a] focus:border-[#4D23A5] focus:ring-2 focus:ring-[#4D23A5]/20 focus:outline-none transition-all duration-300 placeholder-[#8F8F8F]"
                placeholder="Enter your username"
                defaultValue={UserProfileResponse?.user?.userName}
                {...registerUpdateProfile('userName')}
              />
              {errosUpdateProfile.userName && (
                <span className="text-red-400 text-sm flex items-center space-x-1 mt-2">
                  <span>⚠️</span>
                  <span>{errosUpdateProfile.userName.message}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {isSubmitting ? (
              <div className="flex items-center space-x-3 px-6 py-3 rounded-xl bg-[#272932] border border-[#3a3d4a]">
                <div className="w-5 h-5 border-2 border-[#4D23A5] border-t-transparent rounded-full animate-spin" />
                <span className="text-[#d0cac7] font-medium">Uploading...</span>
              </div>
            ) : (
              <Button
                variant="primary"
                loading={isUpdatingProfile}
                disabled={!hasChanges || isSubmitting}
                className={!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Save Changes
              </Button>
            )}

            <Button
              type="button"
              variant="cancel"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
