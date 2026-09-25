import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail } from 'lucide-react'
import type { z } from 'zod'

import { forgotPasswordSchema } from '../schemas/forgotPasswordSchema'
import { api } from '../hooks/useApi'
import { Button } from './button'
import { AuthInput } from './authInput'

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export function FormForgotPassword() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  async function onSubmit(data: ForgotPasswordForm) {
    await api.forgotPassword(data.email)
    setSent(true)
  }

  if (sent) {
    return (
      <p className="text-sm text-gray-300">
        Se existir uma conta com esse email, enviamos um link pra você
        redefinir a senha. Confira sua caixa de entrada (e o spam).
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <p className="text-sm text-gray-400">
        Digite o email da sua conta pra receber um link de redefinição de
        senha.
      </p>

      <AuthInput
        id="email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
        icon={<Mail size={18} />}
        error={errors.email}
        {...register('email')}
      />

      <Button variant="primary" size="md" fullWidth loading={isSubmitting}>
        Enviar link
      </Button>
    </form>
  )
}
