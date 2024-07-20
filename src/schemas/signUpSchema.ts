import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must have at least 6 caracters')
})
