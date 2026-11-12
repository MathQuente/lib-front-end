import { X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useResendVerification } from '../hooks/useResendVerification'
import { focusRing } from '../styles/focus'
import { Button } from './button'

const DISMISSED_KEY = 'emailNoticeDismissed'

export function EmailVerificationNotice() {
  const { user } = useAuth()
  const { resend, isSending, waitLabel } = useResendVerification()
  const [dismissedFor, setDismissedFor] = useState(() =>
    sessionStorage.getItem(DISMISSED_KEY)
  )

  if (!user?.id || user.emailVerified !== false) return null
  if (dismissedFor === user.id) return null

  const userId = user.id

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, userId)
    setDismissedFor(userId)
  }

  return (
    <section
      aria-label="Confirmação de e-mail"
      className="mb-4 flex flex-col gap-2 rounded border border-dark-border bg-dark-bg-light px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 md:mb-6"
    >
      <div className="min-w-0">
        <p className="text-sm text-gray-300">
          Confirme seu e-mail. Enviamos um link para{' '}
          <span className="break-words font-medium text-white">
            {user.email}
          </span>
          .
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Não encontrou? Veja também a pasta de spam ou lixo eletrônico e
          procure por euzerei.suporte@gmail.com.
        </p>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={isSending}
          disabled={!!waitLabel}
          onClick={resend}
          className="tabular-nums"
        >
          {waitLabel ? `Reenviar em ${waitLabel}` : 'Reenviar'}
        </Button>
        <button
          type="button"
          onClick={dismiss}
          title="Fechar aviso"
          aria-label="Fechar aviso"
          className={`rounded-sm p-2 text-gray-400 transition-colors hover:text-white ${focusRing}`}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
