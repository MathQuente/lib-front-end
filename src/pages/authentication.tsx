import * as Tabs from '@radix-ui/react-tabs'

import photo1 from '../assets/bunpal1.png'
import photo2 from '../assets/bunpal2.png'
import photo3 from '../assets/bunpal3.png'
import photo4 from '../assets/bunpal4.png'

import { RxEnvelopeClosed, RxLockClosed } from 'react-icons/rx'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import { loginSchema } from '../schemas/loginSchema'
import { signUpSchema } from '../schemas/signUpSchema'

import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth/authContext'

export function Authentication() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  type loginForm = z.infer<typeof loginSchema>
  type signUpForm = z.infer<typeof signUpSchema>

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin }
  } = useForm<loginForm>({
    resolver: zodResolver(loginSchema)
  })

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: errorsSignUp }
  } = useForm<signUpForm>({
    resolver: zodResolver(signUpSchema)
  })

  async function loginHandleSubmit(data: loginForm) {
    if (data) {
      const isLogged = await auth.login(data.email, data.password)
      if (isLogged) {
        navigate('/')
      } else {
        alert('Não deu certo')
      }
    }
  }

  async function signUpHandleSubmit(data: signUpForm) {
    if (data) {
      const isCreated = await auth.signup(data.email, data.password)
      console.log(isCreated)
      if (isCreated) {
        navigate('/')
      } else {
        alert('Não deu certo')
      }
    }
  }

  return (
    <div className="flex flex-row">
      <div className="flex px-6 py-8 w-full md:h-screen lg:py-0 bg-[#272932] z-50 ">
        <Tabs.Root
          className="flex flex-col items-center mt-44 ml-28"
          defaultValue="account"
        >
          <Tabs.List className="shrink-0 flex  border-[#3F4149] ">
            <Tabs.Trigger
              className="w-80 h-[60px] data-[state=active]:shadow-[inset_0_-5px_0_0,0_1px_0_0] 
              cursor-default data-[state=active]:text-[#8C67F6] text-[#3F4149] 
              font-bold shadow-[inset_0_-5px_0_0,0_1px_0_0]"
              value="account"
            >
              LOGIN
            </Tabs.Trigger>
            <Tabs.Trigger
              className="w-80 h-[60px] data-[state=active]:shadow-[inset_0_-5px_0_0,0_1px_0_0] 
              cursor-default data-[state=active]:text-[#8C67F6] text-[#3F4149] 
              font-bold shadow-[inset_0_-5px_0_0,0_1px_0_0]"
              value="documents"
            >
              SIGN UP
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="account">
            <section className="w-[600px]">
              <form
                onSubmit={handleSubmitLogin(loginHandleSubmit)}
                className="space-y-4 md:space-y-6"
              >
                <div className="relative">
                  <div className="mt-14">
                    <label
                      htmlFor="email"
                      className="relative block mb-2 text-[#ECECEC]"
                    >
                      <p className="mb-2 text-[#ECECEC]">Email</p>
                      <RxEnvelopeClosed
                        className="pointer-events-none absolute top-[53px] transform -translate-y-1/2 left-4"
                        color="#8F8F8F"
                        size={20}
                      />

                      <input
                        type="email"
                        placeholder="Please Enter your Email"
                        className="bg-[#1A1C26] text-[#8F8F8F] rounded-lg block w-full p-2.5 pl-10"
                        {...registerLogin('email')}
                      />
                    </label>
                    {errorsLogin.email && (
                      <span className="text-red-500">
                        {errorsLogin.email.message}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="relative block mt-2 mb-2 text-[#ECECEC]"
                  >
                    <p className="mb-2 text-[#ECECEC]">Password</p>
                    <RxLockClosed
                      className="pointer-events-none absolute top-[53px] transform -translate-y-1/2 left-3"
                      color="#8F8F8F"
                      size={20}
                    />

                    <input
                      type="password"
                      placeholder="Please Enter your Password"
                      className="bg-[#1A1C26] text-[#8F8F8F] rounded-lg block w-full p-2.5 pl-10"
                      {...registerLogin('password')}
                    />
                  </label>
                  {errorsLogin.password && (
                    <span className="text-red-500">
                      {errorsLogin.password.message}
                    </span>
                  )}
                </div>
                <a
                  href="#"
                  className="text-sm text-primary-600 hover:underline text-[#8C67F6]"
                >
                  Forgot password?
                </a>

                <div className="block">
                  <button
                    type="submit"
                    className="w-full text-white bg-[#642CCD] hover:bg-[#643CCD] 
                    focus:ring-4 rounded-lg text-sm px-5 py-2.5 mt-64"
                  >
                    Login
                  </button>
                </div>
              </form>
            </section>
          </Tabs.Content>

          <Tabs.Content value="documents">
            <section className="w-[600px]">
              <form
                onSubmit={handleSubmitSignUp(signUpHandleSubmit)}
                className="space-y-4 md:space-y-6"
              >
                <div className="relative">
                  <div className="mt-14">
                    <label
                      htmlFor="email"
                      className="relative block mb-2 text-[#ECECEC]"
                    >
                      <p className="mb-2 text-[#ECECEC]">Email</p>
                      <RxEnvelopeClosed
                        className="pointer-events-none absolute top-[53px] transform -translate-y-1/2 left-4"
                        color="#8F8F8F"
                        size={20}
                      />

                      <input
                        type="email"
                        placeholder="Please Enter your Email"
                        className="bg-[#1A1C26] text-[#8F8F8F] rounded-lg block w-full p-2.5 pl-10"
                        {...registerSignUp('email')}
                      />
                    </label>
                    {errorsSignUp.email && (
                      <span className="text-red-500">
                        {errorsSignUp.email.message}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="relative block mt-2 mb-2 text-[#ECECEC]"
                  >
                    <p className="mb-2 text-[#ECECEC]">Password</p>
                    <RxLockClosed
                      className="pointer-events-none absolute top-[53px] transform -translate-y-1/2 left-3"
                      color="#8F8F8F"
                      size={20}
                    />

                    <input
                      type="password"
                      placeholder="Please Enter your Password"
                      className="bg-[#1A1C26] text-[#8F8F8F] rounded-lg block w-full p-2.5 pl-10"
                      {...registerSignUp('password')}
                    />
                  </label>
                  {errorsSignUp.password && (
                    <span className="text-red-500">
                      {errorsSignUp.password.message}
                    </span>
                  )}
                </div>

                <div className="block">
                  <button
                    type="submit"
                    className="w-full text-white bg-[#642CCD] hover:bg-[#643CCD] 
                    focus:ring-4 rounded-lg text-sm px-5 py-2.5 mt-64"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </section>
          </Tabs.Content>
        </Tabs.Root>
      </div>
      <div className="flex flex-col items-center justify-center w-full bg-[#1A1C26]">
        <div className="absolute right-[630px] top-[275px] z-0">
          <img className="" src={photo1} alt="" />
        </div>
        <div className="absolute right-[410px] top-[741px] z-0">
          <img className="" src={photo2} alt="" />
        </div>
        <div className="absolute right-[0px] top-[0px] z-0">
          <img className="" src={photo3} alt="" />
        </div>
        <div className="absolute right-[0px] top-[278px] z-0">
          <img className="" src={photo4} alt="" />
        </div>
      </div>
    </div>
  )
}
