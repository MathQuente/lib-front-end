import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import type { z } from 'zod'

import { X, Camera, Globe, Lock } from 'lucide-react'
import userProfilePictureDefault from '../../assets/Default_pfp.svg.png'

import { updateProfileSchema } from '../../schemas/profileSchema'
import { useUserProfile } from '../../hooks/useUserProfile'
import { Button } from '../button'
import { SteamImportSection } from './steamImportSection'
import type { UserGamesFormProps } from '../../interfaces/user'

type ProfileForm = z.infer<typeof updateProfileSchema>

export function UserProfileForm({ afterSave, onCancel }: UserGamesFormProps) {
  const [profilePicturePreview, setProfilePicturePreview] = useState('')
  const [userBannerPreview, setUserBannerPreview] = useState('')
  const [hasExistingBanner, setHasExistingBanner] = useState(false)
  const [shouldRemoveBanner, setShouldRemoveBanner] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isPublic, setIsPublic] = useState(true)

  const [originalValues, setOriginalValues] = useState({
    userName: '',
    profilePicture: '',
    userBanner: '',
    isPublic: true
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
    register: registerField,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ProfileForm>({
    resolver: zodResolver(updateProfileSchema)
  })

  const watchedValues = watch()

  useEffect(() => {
    if (UserProfileResponse?.user.userBanner) {
      setHasExistingBanner(true)
    }
    if (UserProfileResponse?.user) {
      setValue('userName', UserProfileResponse.user.userName || '')
      setIsPublic(UserProfileResponse.user.isPublic)
      setOriginalValues({
        userName: UserProfileResponse.user.userName || '',
        profilePicture: UserProfileResponse.user.profilePicture || '',
        userBanner: UserProfileResponse.user.userBanner || '',
        isPublic: UserProfileResponse.user.isPublic
      })
    }
  }, [UserProfileResponse?.user])

  useEffect(() => {
    if (!UserProfileResponse?.user) return
    const hasUserNameChanged =
      (watchedValues.userName || '') !== originalValues.userName
    const hasAnyChanges =
      hasUserNameChanged ||
      !!profilePicturePreview ||
      !!userBannerPreview ||
      shouldRemoveBanner ||
      isPublic !== originalValues.isPublic
    setHasChanges(hasAnyChanges)
  }, [
    watchedValues,
    profilePicturePreview,
    userBannerPreview,
    shouldRemoveBanner,
    isPublic,
    originalValues,
    UserProfileResponse?.user
  ])

  async function onSubmit(data: FieldValues) {
    if (!hasChanges) return

    const updateData: {
      userName?: string
      profilePicture?: File
      userBanner?: File | null
      isPublic?: boolean
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
    if (isPublic !== originalValues.isPublic) {
      updateData.isPublic = isPublic
    }

    if (Object.keys(updateData).length > 0) {
      updateUserProfile(updateData)
    }
  }

  const handleBannerChange = (e: FieldValues) => {
    const file = e.target.files?.[0]
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
    setIsPublic(originalValues.isPublic)
    setValue('userName', UserProfileResponse?.user?.userName || '')
    setValue('profilePicture', null)
    setValue('userBanner', null)
    onCancel?.()
  }

  const bannerSrc =
    userBannerPreview ||
    (!shouldRemoveBanner ? UserProfileResponse?.user?.userBanner : undefined)

  const profilePicSrc =
    profilePicturePreview ||
    UserProfileResponse?.user?.profilePicture ||
    userProfilePictureDefault

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <div className="relative h-28 group">
          {bannerSrc ? (
            <img
              src={bannerSrc}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-dark-border" />
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="cursor-pointer rounded-lg has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-light">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                {...registerField('userBanner', {
                  onChange: handleBannerChange
                })}
              />
              <div className="p-2 rounded-lg bg-dark-bg-light/80 border border-dark-border text-gray-300 hover:text-white transition-colors">
                <Camera size={18} />
              </div>
            </label>

            {(hasExistingBanner || userBannerPreview) && (
              <button
                type="button"
                onClick={handleRemoveBanner}
                className="p-2 rounded-lg bg-red-900/60 border border-red-800 text-red-300 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="absolute left-6 bottom-0 translate-y-1/2">
          <label className="group relative block size-14 rounded-full border-2 border-primary bg-dark-bg overflow-hidden cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-light">
            <img
              src={profilePicSrc}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
              <Camera size={16} className="text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              {...registerField('profilePicture', {
                onChange: e => {
                  const file = e.target.files?.[0]
                  if (file) setProfilePicturePreview(URL.createObjectURL(file))
                }
              })}
            />
          </label>
          {errors.profilePicture && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.profilePicture.message}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 pt-10 pb-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="userName" className="text-sm text-gray-400">
            Username
          </label>
          <input
            id="userName"
            type="text"
            placeholder={UserProfileResponse?.user?.userName}
            className="bg-dark-bg-darker text-white placeholder-gray-500 rounded-lg block w-full text-sm py-3 px-3 border border-dark-border focus:border-primary outline-2 outline-offset-1 outline-transparent focus-visible:outline-primary-light transition-colors duration-150"
            {...registerField('userName')}
          />
          <span className="text-red-500 text-xs min-h-[1rem]">
            {errors.userName?.message ?? ' '}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-dark-border bg-dark-bg-darker px-3 py-2.5">
          <div className="flex items-start gap-2.5">
            {isPublic ? (
              <Globe className="size-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
            ) : (
              <Lock className="size-4 text-gray-400 mt-0.5 shrink-0" aria-hidden="true" />
            )}
            <div className="flex flex-col">
              <span className="text-sm text-white">
                {isPublic ? 'Perfil público' : 'Perfil privado'}
              </span>
              <span className="text-xs text-gray-400">
                {isPublic
                  ? 'Qualquer pessoa com o link pode ver seu perfil.'
                  : 'Seu perfil fica visível só pra você.'}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isPublic}
            aria-label="Alternar visibilidade do perfil"
            onClick={() => setIsPublic(v => !v)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${
              isPublic ? 'bg-primary' : 'bg-dark-border'
            }`}
          >
            <span
              className={`inline-block size-3.5 transform rounded-full bg-white transition-transform duration-150 ${
                isPublic ? 'translate-x-[19px]' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <SteamImportSection steamId={UserProfileResponse?.user?.steamId ?? null} />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="cancel"
            onClick={handleCancel}
            disabled={isUpdatingProfile}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            loading={isUpdatingProfile}
            disabled={!hasChanges || isUpdatingProfile}
          >
            Salvar
          </Button>
        </div>
      </div>
    </form>
  )
}
