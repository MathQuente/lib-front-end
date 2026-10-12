import { isAxiosError } from 'axios'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../components/button'
import { api } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import { useResendVerification } from '../hooks/useResendVerification'
import { getErrorMessage } from '../utils/getErrorMessage'

type Status = 'ready' | 'success' | 'invalid'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light'

const primaryLinkClass = `inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-base font-bold text-white transition-colors duration-200 hover:bg-primary-light active:scale-[0.98] sm:w-auto ${focusRing}`

const quietLinkClass = `inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-base text-gray-300 transition-colors hover:text-white sm:w-auto ${focusRing}`

const actionButtonClass = 'w-full tabular-nums sm:w-auto'

function Email({ children }: { children: ReactNode }) {
  return <span className="break-words font-medium text-white">{children}</span>
}

export function VerifyEmailPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [token] = useState(() => searchParams.get('token'))
  const [status, setStatus] = useState<Status>(token ? 'ready' : 'invalid')
  const [isConfirming, setIsConfirming] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { user, refreshUser } = useAuth()
  const { resend, isSending, waitLabel } = useResendVerification()
  const [wasUnverified, setWasUnverified] = useState(false)
  const confirming = useRef(false)

  useEffect(() => {
    if (!searchParams.has('token')) return
    const next = new URLSearchParams(searchParams)
    next.delete('token')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const confirm = async () => {
    if (!token || confirming.current) return
    confirming.current = true
    setIsConfirming(true)
    setErrorMessage(null)
    setWasUnverified(user?.emailVerified === false)

    try {
      await api.verifyEmail(token)
      await refreshUser()
      setStatus('success')
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        setStatus(current => (current === 'success' ? current : 'invalid'))
        return
      }
      setErrorMessage(
        getErrorMessage(
          error,
          'Não foi possível confirmar agora. Tente novamente.'
        )
      )
    } finally {
      confirming.current = false
      setIsConfirming(false)
    }
  }

  const isLoggedIn = !!user?.id
  const alreadyVerified =
    status === 'invalid' && isLoggedIn && user?.emailVerified === true
  const confirmedOwnEmail =
    isLoggedIn && wasUnverified && user?.emailVerified === true

  const libraryLink = (
    <Link to="/userLibrary" className={primaryLinkClass}>
      Ir para a biblioteca
    </Link>
  )

  const loginLink = (
    <Link to="/auth?tab=login" className={primaryLinkClass}>
      Entrar
    </Link>
  )

  let title = 'Confirmar seu e-mail'
  let body: ReactNode =
    'Falta um clique para ligar este e-mail à sua conta no EuZerei.'
  let actions: ReactNode = (
    <Button
      type="button"
      variant="primary"
      size="md"
      loading={isConfirming}
      onClick={confirm}
      className={actionButtonClass}
    >
      Confirmar e-mail
    </Button>
  )
  let note: ReactNode = 'O link vale por 24 horas e só pode ser usado uma vez.'

  if (alreadyVerified) {
    title = 'Seu e-mail já está confirmado.'
    body = null
    actions = libraryLink
    note = null
  } else if (status === 'success') {
    title = 'E-mail confirmado.'
    body = confirmedOwnEmail ? (
      <>
        O endereço <Email>{user?.email}</Email> agora está ligado à sua conta.
      </>
    ) : isLoggedIn ? (
      'O e-mail da conta deste link foi confirmado.'
    ) : (
      'Entre na sua conta para continuar.'
    )
    actions = isLoggedIn ? libraryLink : loginLink
    note = null
  } else if (status === 'invalid') {
    title = 'Este link não vale mais.'
    body = isLoggedIn ? (
      <>
        Ele expirou ou já foi usado. Envie um novo para{' '}
        <Email>{user?.email}</Email>.
      </>
    ) : (
      'Ele expirou ou já foi usado. Entre na sua conta para pedir um novo.'
    )
    actions = isLoggedIn ? (
      <>
        <Button
          type="button"
          variant="primary"
          size="md"
          loading={isSending}
          disabled={!!waitLabel}
          onClick={resend}
          className={actionButtonClass}
        >
          {waitLabel ? `Reenviar em ${waitLabel}` : 'Reenviar link'}
        </Button>
        <Link to="/userLibrary" className={quietLinkClass}>
          Ir para a biblioteca
        </Link>
      </>
    ) : (
      loginLink
    )
    note = null
  }

  return (
    <div
      aria-live="polite"
      className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center"
    >
      <h1 className="max-w-full text-balance break-words font-display text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
        {title}
      </h1>

      {body && <p className="max-w-md text-base text-gray-300">{body}</p>}

      {errorMessage && (
        <p className="max-w-md text-sm text-gray-300">{errorMessage}</p>
      )}

      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 sm:w-auto sm:flex-row">
        {actions}
      </div>

      {note && <p className="text-sm text-gray-400">{note}</p>}
    </div>
  )
}
