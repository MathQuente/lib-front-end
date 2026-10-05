import { z } from 'zod'
import { passwordSchema } from './passwordSchema'

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: passwordSchema
})
