import type { z } from 'zod'
import { loginSchema } from '../schemas/loginSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth/authContext'
import { useNavigate } from 'react-router-dom'
import { Mail, LockOpen } from 'lucide-react'
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
    formState: { errors }
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
          icon={<LockOpen size={18} />}
          error={errors.password}
          {...register('password')}
        />
        <a
          href="/forgotPasswordPage"
          className="text-xs text-[#8C67F6] hover:underline self-end mt-1"
        >
          Esqueceu a senha?
        </a>
      </div>

      <Button variant="primary" fullWidth>
        Entrar
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#2A2B36]" />
        <span className="text-[11px] text-gray-600 uppercase tracking-wider">
          ou
        </span>
        <div className="h-px flex-1 bg-[#2A2B36]" />
      </div>

      <div className="flex flex-col gap-2">
        <GoogleAuthButton />
        <DiscordAuthButton />
      </div>
    </form>
  )
}
