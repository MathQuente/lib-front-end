import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FormResetPassword } from '../components/formResetPassword'
import { api } from '../hooks/useApi'

export function ResetPasswordPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [token] = useState(() => searchParams.get('token'))
  const [isValid, setIsValid] = useState<boolean | null>(token ? null : false)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    api
      .isResetTokenValid(token)
      .then(valid => {
        if (!cancelled) setIsValid(valid)
      })
      .catch(() => {
        if (!cancelled) setIsValid(true)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    if (!searchParams.has('token')) return
    const next = new URLSearchParams(searchParams)
    next.delete('token')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  return (
    <div className="flex justify-center pt-2 pb-8 md:pt-4 md:pb-12">
      <div className="w-full max-w-md">
        <h1 className="text-white font-semibold text-lg mb-6">
          Redefinir senha
        </h1>

        {isValid === null ? (
          <p className="text-sm text-gray-400">Verificando o link...</p>
        ) : token && isValid ? (
          <FormResetPassword token={token} />
        ) : (
          <p className="text-sm text-gray-400">
            Link inválido, expirado ou já usado. Peça um novo link na tela de{' '}
            <Link
              to="/forgot-password"
              className="text-primary-light hover:underline"
            >
              esqueci a senha
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  )
}
