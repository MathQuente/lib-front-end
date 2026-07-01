import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, LockOpen } from 'lucide-react'
import { signUpSchema } from '../schemas/signUpSchema'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth/authContext'
import type { z } from 'zod'

import { Button } from './button'
import { GoogleAuthButton } from './googleAuthButton'
import { DiscordAuthButton } from './discordAuthButton'
import { AuthInput } from './authInput'

type SignUpForm = z.infer<typeof signUpSchema>

export function FormSignUp() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema)
  })

  async function onSubmit(data: SignUpForm) {
    const errorMessage = await auth.signup(data.email, data.password)
    if (!errorMessage) {
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/'
      navigate(redirectTo, { replace: true })
      localStorage.removeItem('redirectAfterLogin')
      return
    }

    setError('email', { message: errorMessage })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <AuthInput
        id="email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        icon={<Mail size={18} />}
        error={errors.email}
        {...register('email')}
      />

      <AuthInput
        id="password"
        label="Senha"
        type="password"
        placeholder="••••••••"
        icon={<LockOpen size={18} />}
        error={errors.password}
        {...register('password')}
      />

      <Button variant="primary" fullWidth>
        Criar conta
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-dark-border" />
        <span className="text-[11px] text-gray-600 uppercase tracking-wider">
          ou
        </span>
        <div className="h-px flex-1 bg-dark-border" />
      </div>

      <div className="flex flex-col gap-2">
        <GoogleAuthButton />
        <DiscordAuthButton />
      </div>
    </form>
  )
}
