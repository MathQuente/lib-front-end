import { isAxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../utils/getErrorMessage'
import { api } from './useApi'
import { useAuth } from './useAuth'

const COOLDOWN_SECONDS = 60
const STORAGE_KEY = 'emailVerificationResendCooldown'
const STATE_EVENT = 'email-verification:resend-state'

let requestInFlight = false

function readSecondsLeft(userId: string | undefined) {
  if (!userId) return 0

  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null')
    if (stored?.userId !== userId) return 0
    const availableAt = Number(stored.availableAt)
    if (!Number.isFinite(availableAt)) return 0
    return Math.max(0, Math.ceil((availableAt - Date.now()) / 1000))
  } catch {
    return 0
  }
}

function startCooldown(userId: string, seconds: number) {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ userId, availableAt: Date.now() + seconds * 1000 })
  )
}

function retryAfterSeconds(error: unknown) {
  if (!isAxiosError(error) || error.response?.status !== 429) return null
  const retryAfter = Number(error.response.headers?.['retry-after'])
  return Number.isFinite(retryAfter) && retryAfter > 0
    ? Math.ceil(retryAfter)
    : COOLDOWN_SECONDS
}

function formatWait(seconds: number) {
  return seconds > 90 ? `${Math.ceil(seconds / 60)} min` : `${seconds}s`
}

export function useResendVerification() {
  const { user } = useAuth()
  const userId = user?.id
  const [isSending, setIsSending] = useState(requestInFlight)
  const [secondsLeft, setSecondsLeft] = useState(() => readSecondsLeft(userId))
  const isCoolingDown = secondsLeft > 0

  const sync = useCallback(() => {
    setIsSending(requestInFlight)
    setSecondsLeft(readSecondsLeft(userId))
  }, [userId])

  useEffect(() => {
    sync()
    window.addEventListener(STATE_EVENT, sync)
    return () => window.removeEventListener(STATE_EVENT, sync)
  }, [sync])

  useEffect(() => {
    if (!isCoolingDown) return
    const timer = window.setInterval(sync, 1000)
    return () => window.clearInterval(timer)
  }, [isCoolingDown, sync])

  const resend = async () => {
    if (!userId || requestInFlight || readSecondsLeft(userId) > 0) return
    requestInFlight = true
    window.dispatchEvent(new Event(STATE_EVENT))

    try {
      await api.resendVerification()
      startCooldown(userId, COOLDOWN_SECONDS)
      toast.success(`Enviamos um novo link para ${user?.email}.`)
    } catch (error) {
      const wait = retryAfterSeconds(error)
      if (wait) startCooldown(userId, wait)
      toast.error(
        getErrorMessage(error, 'Não foi possível enviar o email agora.')
      )
    } finally {
      requestInFlight = false
      window.dispatchEvent(new Event(STATE_EVENT))
    }
  }

  return {
    resend,
    isSending,
    secondsLeft,
    waitLabel: isCoolingDown ? formatWait(secondsLeft) : null,
  }
}
