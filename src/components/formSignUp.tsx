import { zodResolver } from '@hookform/resolvers/zod'
import { RxEnvelopeClosed, RxLockOpen2 } from 'react-icons/rx'
import { signUpSchema } from '../schemas/signUpSchema'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth/authContext'
import type { z } from 'zod'

export function FormSignUp() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  type signUpForm = z.infer<typeof signUpSchema>
  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: errorsSignUp },
  } = useForm<signUpForm>({
    resolver: zodResolver(signUpSchema),
  })

  async function signUpHandleSubmit(data: signUpForm) {
    const success = await auth.signup(data.email, data.password)
    if (success) {
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/'
      navigate(redirectTo, { replace: true })
      localStorage.removeItem('redirectAfterLogin')
    }
  }
  return (
    <form
      onSubmit={handleSubmitSignUp(signUpHandleSubmit)}
      className="flex flex-col"
    >
      <div className="px-2 w-full flex flex-col pt-[66px] nesthub:pt-8 flex-grow">
        <div>
          <label htmlFor="email" className="relative block text-[#ECECEC]">
            <p className="mb-4 text-base md:text-xl text-[#ECECEC] font-medium">
              Email Adress
            </p>
            <RxEnvelopeClosed
              className="pointer-events-none absolute top-[70px] md:top-[74px] transform -translate-y-1/2 left-5 size-5 md:size-6"
              color="#8F8F8F"
              size={20}
            />
            <input
              type="email"
              id="email"
              placeholder="Please Enter your Email"
              className={`bg-[#1A1C26] text-[#8F8F8F] rounded-xl block w-full sm:w-full md:w-full lg:w-full xl:w-full 2xl:w-full text-sm md:text-xl
               p-2.5 pl-12 h-14 md:h-14 md:pl-14 
          ${
            errorsSignUp.email
              ? 'border-2 border-red-500 focus:outline-none'
              : 'border-transparent'
          } 
          ${
            !errorsSignUp.email
              ? 'focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
              : ''
          }`}
              {...registerSignUp('email')}
            />
          </label>
          {errorsSignUp.email && (
            <span className="text-red-500">{errorsSignUp.email.message}</span>
          )}
        </div>

        <div className="pt-[35px]">
          <label htmlFor="password" className="relative block text-[#ECECEC]">
            <p className="mb-4 text-base md:text-xl text-[#ECECEC] font-medium capitalize">
              Password
            </p>
            <RxLockOpen2
              className="pointer-events-none absolute top-[70px] md:top-[74px] transform -translate-y-1/2 left-5 size-5 md:size-6"
              color="#8F8F8F"
              size={20}
            />
            <input
              type="password"
              id="password"
              placeholder="Please Enter your Password"
              className={`bg-[#1A1C26] text-[#8F8F8F] rounded-xl block w-full sm:w-full md:w-full lg:w-full xl:w-full 2xl:w-full text-sm md:text-xl
               p-2.5 pl-12 h-14 md:h-14 md:pl-14 
         ${
           errorsSignUp.password
             ? 'border-2 border-red-500 focus:outline-none'
             : 'border-transparent'
         }
        ${
          !errorsSignUp.password
            ? 'focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
            : ''
        }`}
              {...registerSignUp('password')}
            />
          </label>
          {errorsSignUp.password && (
            <span className="text-red-500">
              {errorsSignUp.password.message}
            </span>
          )}
        </div>
      </div>

      <div className="w-full pt-[9.72rem] sm:pt-[22.25rem] nesthub:pt-[6.25rem]">
        <button
          type="submit"
          className="w-full text-xl md:text-xl font-semibold h-12 md:h-14 inline-flex items-center justify-center text-[#FFFFFF] bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105 hover:from-[#5D23A5] hover:to-[#813FCF] focus:ring-4 rounded-xl"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}
