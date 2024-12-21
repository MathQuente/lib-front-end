import { CiSearch } from 'react-icons/ci'

import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApi } from '../hooks/useApi'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { UserProfileResponse } from '../types/user'
import { Link } from 'react-router-dom'
import userProfilePictureDefault from '../assets/Default_pfp.svg.png'
import { useAuth } from '../hooks/useAuth'

const searchSchema = z.object({
  gameName: z
    .string()
    .min(1, { message: 'a pesquisa não pode ser vazia' })
    .refine(value => !/^\s*$/.test(value), {
      message: 'pesquisa não pode ter apenas espaços',
    }),
})

export function Navbar() {
  const api = useApi()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })

  type searchForm = z.infer<typeof searchSchema>

  const {
    register,
    handleSubmit,

    // formState: { errors }
  } = useForm<searchForm>({
    resolver: zodResolver(searchSchema),
  })

  const { data: UserProfileResponse } = useQuery<UserProfileResponse>({
    queryKey: ['userProfile', userId],
    queryFn: async () => api.getUserProfile(userId),
    placeholderData: keepPreviousData,
  })

  if (!UserProfileResponse) {
    return null
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())

    url.searchParams.set('search', search)

    window.history.pushState({}, '', url)

    setSearch(search)
  }

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
  }
  // const [user, setUser] = useState({})

  // async function findUserLogged() {
  //   try {
  //     const response = await userLogged()
  //     setUser(response.data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   if (Cookies.get('token')) {
  //     findUserLogged()
  //   }
  // }, [])

  function onSearch(data: searchForm) {
    console.log(data)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <form
          onSubmit={handleSubmit(onSearch)}
          className="flex gap-3 items-center"
        >
          <div className="left-[20rem] top-[2rem] w-[30rem] mx-44 mt-10">
            <CiSearch className="size-6 text-[#8F8F8F] absolute top-[3.625rem] left-[12.5rem]" />
            <input
              {...register('gameName')}
              onChange={onSearchInputChange}
              value={search}
              className="bg-[#272932] text-[#8F8F8F] rounded-2xl block w-full h-[62px] pl-[62px]"
              type="text"
              placeholder="Search"
            />
          </div>
        </form>
        <div className="mt-10 mr-10">
          {userId ? (
            <Link to="/userLibrary">
              <img
                src={
                  UserProfileResponse.user.profilePicture === null
                    ? userProfilePictureDefault
                    : UserProfileResponse.user.profilePicture
                }
                alt=""
                className="object-fill size-16 rounded-2xl"
              />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="absolute right-[24rem] top-[2rem] text-[#8F8F8F]"
            >
              <button type="button" name="Entrar">
                Entrar
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
