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
      className="flex flex-col h-full justify-between"
    >
      <div className="px-2 w-full flex flex-col pt-[66px] flex-grow">
        <div>
          <label htmlFor="email" className="relative block text-[#ECECEC]">
            <p className="mb-4 text-base text-[#ECECEC] font-medium">
              Email Adress
            </p>
            <RxEnvelopeClosed
              className="pointer-events-none absolute top-[72px] transform -translate-y-1/2 left-4"
              color="#8F8F8F"
              size={20}
            />
            <input
              type="email"
              id="email"
              placeholder="Please Enter your Email"
              className={`bg-[#1A1C26] text-[#8F8F8F] rounded-xl block w-full p-2.5 pl-12 h-[62px] 
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

        <div>
          <label htmlFor="password" className="relative block text-[#ECECEC]">
            <p className="pt-[35px] mb-4 text-base text-[#ECECEC] font-medium capitalize">
              Password
            </p>
            <RxLockOpen2
              className="pointer-events-none absolute top-[107px] transform -translate-y-1/2 left-4"
              color="#8F8F8F"
              size={20}
            />
            <input
              type="password"
              id="password"
              placeholder="Please Enter your Password"
              className={`bg-[#1A1C26] text-[#8F8F8F] rounded-xl block w-full p-2.5 pl-12 h-[62px] 
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

      {/* Botão agora está sempre no final */}
      <div className="w-full pb-[123px]">
        <button
          type="submit"
          className="w-full h-14 inline-flex items-center justify-center  text-[#FFFFFF] text-base font-semibold bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105 hover:from-[#5D23A5] hover:to-[#813FCF] focus:ring-4 rounded-xl px-5 py-2.5"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}
