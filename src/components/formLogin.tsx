import type { z } from 'zod'
import { loginSchema } from '../schemas/loginSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth/authContext'
import { useNavigate } from 'react-router-dom'
import { RxEnvelopeClosed, RxLockOpen2 } from 'react-icons/rx'
import logoGoogle from '../assets/Google__G__logo.svg.png'
import logoDiscord from '../assets/5968756.png'
import { Button } from './button'
import { GoogleAuthButton } from './googleAuthButton'
import { AuthInput } from './authInput'

type LoginForm = z.infer<typeof loginSchema>

export function FormLogin() {
  const GOOGLE_AUTH_URL = 'http://localhost:3333/auth/google'
  const DISCORD_AUTH_URL = 'http://localhost:3333/auth/discord'

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
        icon={<RxEnvelopeClosed size={18} />}
        error={errors.email}
        {...register('email')}
      />

      <div className="flex flex-col gap-1">
        <AuthInput
          id="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          icon={<RxLockOpen2 size={18} />}
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

      <GoogleAuthButton />
    </form>
  )
}
