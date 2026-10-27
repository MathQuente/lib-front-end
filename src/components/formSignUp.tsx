import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock } from 'lucide-react'
import { safeRedirectPath } from '../utils/safeRedirectPath'
import { signUpSchema } from '../schemas/signUpSchema'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useId } from 'react'
import { AuthContext } from '../contexts/auth/authContext'
import type { z } from 'zod'

import { Button } from './button'
import { GoogleAuthButton } from './googleAuthButton'
import { DiscordAuthButton } from './discordAuthButton'
import { AuthInput } from './authInput'
import { focusRing } from '../styles/focus'

type SignUpForm = z.infer<typeof signUpSchema>

export function FormSignUp() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { acceptedTerms: false }
  })
  const termsMessageId = useId()
  const acceptedTerms = watch('acceptedTerms')

  async function onSubmit(data: SignUpForm) {
    const signupError = await auth.signup(
      data.email,
      data.password,
      data.acceptedTerms
    )
    if (!signupError) {
      const redirectTo = safeRedirectPath(
        sessionStorage.getItem('redirectAfterLogin')
      )
      navigate(redirectTo, { replace: true })
      sessionStorage.removeItem('redirectAfterLogin')
      return
    }

    setError(signupError.field, { message: signupError.message })
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
        icon={<Lock size={18} />}
        error={errors.password}
        {...register('password')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-2.5 text-[13px] leading-normal text-gray-300 cursor-pointer max-sm:min-h-11">
          <input
            type="checkbox"
            aria-invalid={errors.acceptedTerms ? true : undefined}
            aria-describedby={termsMessageId}
            className={`mt-0.5 size-4 shrink-0 cursor-pointer accent-primary rounded-sm ${focusRing}`}
            {...register('acceptedTerms')}
          />
          <span>
            Declaro que tenho 18 anos ou mais e aceito os{' '}
            <Link
              to="/termos"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-primary-link underline underline-offset-2 rounded-sm ${focusRing}`}
            >
              Termos de uso
              <span className="sr-only"> (abre em nova aba)</span>
            </Link>{' '}
            e a{' '}
            <Link
              to="/privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-primary-link underline underline-offset-2 rounded-sm ${focusRing}`}
            >
              Política de privacidade
              <span className="sr-only"> (abre em nova aba)</span>
            </Link>
            .
          </span>
        </label>
        <span
          id={termsMessageId}
          className={`pl-[1.625rem] text-xs min-h-[1rem] ${
            errors.acceptedTerms ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          {errors.acceptedTerms?.message ??
            (acceptedTerms ? ' ' : 'Marque a caixa para continuar.')}
        </span>
      </div>

      <Button variant="primary" size="md" fullWidth loading={isSubmitting}>
        Criar conta
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-dark-border" />
        <span className="text-[11px] text-gray-400 uppercase tracking-wider">
          ou
        </span>
        <div className="h-px flex-1 bg-dark-border" />
      </div>

      <div className="flex flex-col gap-2">
        <GoogleAuthButton
          acceptedTerms={acceptedTerms}
          disabled={!acceptedTerms}
          describedBy={termsMessageId}
        />
        <DiscordAuthButton
          acceptedTerms={acceptedTerms}
          disabled={!acceptedTerms}
          describedBy={termsMessageId}
        />
      </div>
    </form>
  )
}
