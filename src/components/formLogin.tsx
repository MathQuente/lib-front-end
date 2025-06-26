import type { z } from 'zod'
import { loginSchema } from '../schemas/loginSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth/authContext'
import { useNavigate } from 'react-router-dom'
import { RxEnvelopeClosed, RxLockOpen2 } from 'react-icons/rx'
import logoGoogle from '../assets/Google__G__logo.svg.png'

export function FormLogin() {
  const GOOGLE_AUTH_URL = 'http://localhost:3333/auth/google'

  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  type loginForm = z.infer<typeof loginSchema>
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm<loginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function loginHandleSubmit(data: loginForm) {
    const success = await auth.login(data.email, data.password)

    if (success) {
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/'
      navigate(redirectTo, { replace: true })
      localStorage.removeItem('redirectAfterLogin')
    }
  }

  return (
    <form
      onSubmit={handleSubmitLogin(loginHandleSubmit)}
      className="flex flex-col"
    >
      <div className="px-2 w-full flex flex-col pt-[66px] nesthub:pt-8 asus:pt-4 flex-grow">
        <div>
          <div className="mt-6 flex justify-center">
            <a
              href={GOOGLE_AUTH_URL}
              className="inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium
                     bg-[#1a1a1e] hover:bg-[#1a1a1e] text-white"
            >
              <img src={logoGoogle} alt="Google" className="h-5 w-5 mr-2" />
              Google
            </a>
          </div>
          <label htmlFor="email" className="relative block text-[#ECECEC]">
            <p className="mb-4 text-base md:text-xl text-[#ECECEC] font-medium">
              Email Adress
            </p>
            <RxEnvelopeClosed
              className="pointer-events-none absolute top-[70px] md:top-[74px] transform -translate-y-1/2 left-5 size-5 md:size-6"
              color="#8F8F8F"
            />
            <input
              type="email"
              id="email"
              placeholder="Please Enter your Email"
              className={`bg-[#1A1C26] text-[#8F8F8F] rounded-xl block w-full sm:w-full md:w-full lg:w-full xl:w-full 2xl:w-full text-sm md:text-xl
               p-2.5 pl-12 h-14 md:pl-14 
            ${
              errorsLogin.email
                ? 'border-2 border-red-500 focus:outline-none'
                : 'border-transparent'
            } 
            ${
              !errorsLogin.email
                ? 'focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                : ''
            }`}
              {...registerLogin('email')}
            />
          </label>
          {errorsLogin.email && (
            <span className="text-red-500">{errorsLogin.email.message}</span>
          )}
        </div>

        <div className="pt-[35px]">
          <label htmlFor="password" className="relative block text-[#ECECEC]">
            <p className="mb-4 text-base md:text-xl text-[#ECECEC] font-medium">
              Password
            </p>
            <RxLockOpen2
              className="pointer-events-none absolute top-[70px] md:top-[74px] transform -translate-y-1/2 left-5 size-5 md:size-6"
              color="#8F8F8F"
            />
            <input
              type="password"
              id="password"
              placeholder="Please Enter your Password"
              className={`bg-[#1A1C26] text-[#8F8F8F] rounded-xl block w-full sm:w-full md:w-full lg:w-full xl:w-full 2xl:w-full text-sm md:text-xl
               p-2.5 pl-12 h-14 md:pl-14 
            ${
              errorsLogin.password
                ? 'border-2 border-red-500 focus:outline-none'
                : 'border-transparent'
            } 
            ${
              !errorsLogin.password
                ? 'focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                : ''
            }`}
              {...registerLogin('password')}
            />
          </label>
          {errorsLogin.password && (
            <span className="text-red-500">{errorsLogin.password.message}</span>
          )}
        </div>

        <a
          href="/forgotPasswordPage"
          className="pt-2 text-sm sm:text-lg md:text-xl text-primary-600 hover:underline text-[#8C67F6]"
        >
          Forgot Password?
        </a>
      </div>

      <div className="w-full pt-32 sm:pt-80 nesthub:pt-16 asus:pt-32">
        <button
          type="submit"
          className="w-full text-xl md:text-xl font-semibold h-12 md:h-14 inline-flex items-center justify-center text-[#FFFFFF] bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105 hover:from-[#5D23A5] hover:to-[#813FCF] focus:ring-4 rounded-xl"
        >
          Login
        </button>
      </div>
    </form>
  )
}
