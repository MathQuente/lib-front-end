import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../utils/getErrorMessage'
import { api } from './useApi'
import { useAuth } from './useAuth'

const COOLDOWN_MS = 60_000
const STORAGE_KEY = 'emailVerificationResendAvailableAt'
const COOLDOWN_EVENT = 'email-verification:cooldown'

function readSecondsLeft() {
  const availableAt = Number(sessionStorage.getItem(STORAGE_KEY))
  if (!Number.isFinite(availableAt)) return 0
  return Math.max(0, Math.ceil((availableAt - Date.now()) / 1000))
}

export function useResendVerification() {
  const { user } = useAuth()
  const [isSending, setIsSending] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(readSecondsLeft)
  const isCoolingDown = secondsLeft > 0

  useEffect(() => {
    const sync = () => setSecondsLeft(readSecondsLeft())
    window.addEventListener(COOLDOWN_EVENT, sync)
    return () => window.removeEventListener(COOLDOWN_EVENT, sync)
  }, [])

  useEffect(() => {
    if (!isCoolingDown) return
    const timer = window.setInterval(
      () => setSecondsLeft(readSecondsLeft()),
      1000
    )
    return () => window.clearInterval(timer)
  }, [isCoolingDown])

  const resend = async () => {
    if (isSending || isCoolingDown) return
    setIsSending(true)

    try {
      await api.resendVerification()
      sessionStorage.setItem(STORAGE_KEY, String(Date.now() + COOLDOWN_MS))
      window.dispatchEvent(new Event(COOLDOWN_EVENT))
      toast.success(`Enviamos um novo link para ${user?.email}.`)
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Não foi possível enviar o email agora.')
      )
    } finally {
      setIsSending(false)
    }
  }

  return { resend, isSending, secondsLeft }
}
