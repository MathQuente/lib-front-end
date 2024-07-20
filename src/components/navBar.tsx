// import { useEffect, useState } from 'react'
// import { userLogged } from '../../services/userServices'
// import Cookies from 'js-cookie'

// import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CiSearch } from 'react-icons/ci'
import { z } from 'zod'
// import userProfilePictureDefault from '../../assets/Default_pfp.svg.png'

const searchSchema = z.object({
  gameName: z
    .string()
    .min(1, { message: 'a pesquisa não pode ser vazia' })
    .refine(value => !/^\s*$/.test(value), {
      message: 'pesquisa não pode ter apenas espaços'
    })
})

export default function Navbar() {
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

  const {
    register
    // handleSubmit,

    // formState: { errors }
  } = useForm({
    resolver: zodResolver(searchSchema)
  })

  // async function onSearch(data) {
  //   console.log(data)
  // }

  return (
    <>
      <form
        // onSubmit={handleSubmit(onSearch)}
        className="absolute left-[20rem] top-[2rem] w-[30rem]"
      >
        <input
          {...register('gameName')}
          type="text"
          placeholder="Pesquise por um game"
          className="bg-[#272932] text-[#8F8F8F] rounded-2xl block w-full p-2.5 pl-10"
        />
        <button type="submit" className="absolute left-[0.7rem] top-[0.6rem]">
          <CiSearch className="text-2xl" color="#8F8F8F" />
        </button>

        {/* {errors && <span>{errors.gameName?.message}</span>} */}
      </form>
      {/* {Cookies.get('token') ? (
        <Link to="/profile" className="absolute right-[24rem] top-[2rem]">
          <img
            src={
              user.profilePicture === null
                ? userProfilePictureDefault
                : user.profilePicture
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
      )} */}
    </>
  )
}
