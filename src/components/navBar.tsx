import { CiSearch } from 'react-icons/ci'

import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { z } from 'zod'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
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

  // const {
  //   register,
  //   handleSubmit,

  //   // formState: { errors }
  // } = useForm<searchForm>({
  //   resolver: zodResolver(searchSchema),
  // })

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

  function onSearch(data: searchForm) {
    console.log(data)
  }

  return (
    <>
      <div className="flex gap-3 items-center justify-center">
        <div className="mt-10 relative">
          {/* O wrapper div agora é relativo */}
          <div className="relative w-full sm:w-72">
            {/* Ícone posicionado absolutamente em relação ao wrapper */}
            <CiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 size-6 text-[#8F8F8F] pointer-events-none" />
            <input
              onChange={onSearchInputChange}
              value={search}
              className="bg-[#272932] text-[#8F8F8F] rounded-2xl block w-full h-[62px] pl-[62px] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>
      </div>
    </>
  )
}
