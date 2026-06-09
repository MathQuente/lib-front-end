import { zodResolver } from '@hookform/resolvers/zod'
import { RxEnvelopeClosed, RxLockOpen2 } from 'react-icons/rx'
import { signUpSchema } from '../schemas/signUpSchema'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth/authContext'
import type { z } from 'zod'
import logoGoogle from '../assets/Google__G__logo.svg.png'
import logoDiscord from '../assets/5968756.png'

import { Button } from './button'
import { GoogleAuthButton } from './googleAuthButton'
import { AuthInput } from './authInput'

type SignUpForm = z.infer<typeof signUpSchema>

export function FormSignUp() {
  const GOOGLE_AUTH_URL = 'http://localhost:3333/auth/google'
  const DISCORD_AUTH_URL = 'http://localhost:3333/auth/discord'

  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema)
  })

  async function onSubmit(data: SignUpForm) {
    const success = await auth.signup(data.email, data.password)
    if (success) {
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/'
      navigate(redirectTo, { replace: true })
      localStorage.removeItem('redirectAfterLogin')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <AuthInput
        id="email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        icon={<RxEnvelopeClosed size={18} />}
        error={errors.email}
        {...register('email')}
      />

      <AuthInput
        id="password"
        label="Senha"
        type="password"
        placeholder="••••••••"
        icon={<RxLockOpen2 size={18} />}
        error={errors.password}
        {...register('password')}
      />

      <Button variant="primary" fullWidth>
        Criar conta
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#2A2B36]" />
        <span className="text-[11px] text-gray-600 uppercase tracking-wider">
          ou
        </span>
        <div className="h-px flex-1 bg-[#2A2B36]" />
      </div>

      <GoogleAuthButton />
    </form>
  )
}
