import type { z } from 'zod'
import { loginSchema } from '../schemas/loginSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth/authContext'
import { useNavigate } from 'react-router-dom'
import { RxEnvelopeClosed, RxLockOpen2 } from 'react-icons/rx'

export function FormLogin() {
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
            <p className="mb-4 text-base text-[#ECECEC] font-medium">
              Password
            </p>
            <RxLockOpen2
              className="pointer-events-none absolute top-[72px] transform -translate-y-1/2 left-4"
              color="#8F8F8F"
              size={20}
            />
            <input
              type="password"
              id="password"
              placeholder="Please Enter your Password"
              className={`bg-[#1A1C26] text-[#8F8F8F] rounded-xl block w-full p-2.5 pl-12 h-[62px] 
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
              {...registerLogin('password')}
            />
          </label>
          {errorsLogin.password && (
            <span className="text-red-500">{errorsLogin.password.message}</span>
          )}
        </div>

        <a
          href="/forgotPasswordPage"
          className="pt-2 text-base text-primary-600 hover:underline text-[#8C67F6]"
        >
          Forgot Password?
        </a>
      </div>

      <div className="w-full pb-[123px]">
        <button
          type="submit"
          className="w-full h-14 inline-flex items-center justify-center  text-[#FFFFFF] text-base font-semibold bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105 hover:from-[#5D23A5] hover:to-[#813FCF] focus:ring-4 rounded-xl px-5 py-2.5"
        >
          Login
        </button>
      </div>
    </form>
  )
}
