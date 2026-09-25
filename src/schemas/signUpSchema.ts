import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres')
})
