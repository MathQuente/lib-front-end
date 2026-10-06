import axios from 'axios'

const GENERIC_API_MESSAGES = new Set([
  'Invalid input',
  'Bad request',
  'Unauthorized',
  'Forbidden',
  'Not found',
  'Method not allowed',
  'Payload too large',
  'Unsupported media type',
  'Too many requests',
])

export function getErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback

  const status = error.response?.status
  if (status === 429) {
    const retryAfter = Number(error.response?.headers?.['retry-after'])
    return Number.isFinite(retryAfter) && retryAfter > 0
      ? `Muitas tentativas. Tente novamente em ${Math.ceil(retryAfter)} segundos.`
      : 'Muitas tentativas. Aguarde um pouco e tente novamente.'
  }
  if (!status || status >= 500) return fallback

  const passwordError = error.response?.data?.error?.password?.[0]
  if (typeof passwordError === 'string') return passwordError

  const message = error.response?.data?.message
  if (typeof message !== 'string' || GENERIC_API_MESSAGES.has(message)) {
    return fallback
  }
  return message
}
