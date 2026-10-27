import { z } from 'zod'
import { passwordSchema } from './passwordSchema'

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  acceptedTerms: z.boolean().refine(value => value, {
    message: 'Confirme que tem 18 anos ou mais e aceita os Termos.'
  })
})
