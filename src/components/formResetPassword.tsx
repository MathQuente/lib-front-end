import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { toast } from 'react-toastify'
import type { z } from 'zod'

import { resetPasswordSchema } from '../schemas/resetPasswordSchema'
import { api } from '../hooks/useApi'
import { Button } from './button'
import { AuthInput } from './authInput'

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export function FormResetPassword({ token }: { token: string }) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema)
  })

  async function onSubmit(data: ResetPasswordForm) {
    const result = await api.resetPassword(token, data.password)
    if (!result) return

    toast.success('Senha redefinida com sucesso 👌')
    navigate('/auth?tab=login', { replace: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <AuthInput
        id="password"
        label="Nova senha"
        type="password"
        placeholder="••••••••"
        icon={<Lock size={18} />}
        error={errors.password}
        {...register('password')}
      />

      <AuthInput
        id="confirmPassword"
        label="Confirmar nova senha"
        type="password"
        placeholder="••••••••"
        icon={<Lock size={18} />}
        error={errors.confirmPassword}
        {...register('confirmPassword')}
      />

      <Button variant="primary" size="md" fullWidth loading={isSubmitting}>
        Redefinir senha
      </Button>
    </form>
  )
}
