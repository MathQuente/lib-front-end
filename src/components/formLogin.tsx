import type { z } from 'zod'
import { loginSchema } from '../schemas/loginSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth/authContext'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { Button } from './button'
import { GoogleAuthButton } from './googleAuthButton'
import { DiscordAuthButton } from './discordAuthButton'
import { AuthInput } from './authInput'

type LoginForm = z.infer<typeof loginSchema>

export function FormLogin() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  async function onSubmit(data: LoginForm) {
    const success = await auth.login(data.email, data.password)
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
        icon={<Mail size={18} />}
        error={errors.email}
        {...register('email')}
      />

      <div className="flex flex-col gap-1">
        <AuthInput
          id="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          error={errors.password}
          {...register('password')}
        />
        <Link
          to="/forgot-password"
          className="text-xs text-primary-light hover:underline self-end mt-1"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <Button variant="primary" size="md" fullWidth loading={isSubmitting}>
        Entrar
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-dark-border" />
        <span className="text-[11px] text-gray-400 uppercase tracking-wider">
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
