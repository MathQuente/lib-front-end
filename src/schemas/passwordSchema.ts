import { z } from 'zod'

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_BYTES = 72

export const passwordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`
  )
  .refine(
    password => new TextEncoder().encode(password).length <= MAX_PASSWORD_BYTES,
    `A senha pode ter no máximo ${MAX_PASSWORD_BYTES} caracteres`
  )
