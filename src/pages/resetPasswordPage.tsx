import { Link, useSearchParams } from 'react-router-dom'
import { FormResetPassword } from '../components/formResetPassword'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div className="flex justify-center pt-2 pb-8 md:pt-4 md:pb-12">
      <div className="w-full max-w-md">
        <h1 className="text-white font-semibold text-lg mb-6">
          Redefinir senha
        </h1>

        {token ? (
          <FormResetPassword token={token} />
        ) : (
          <p className="text-sm text-gray-400">
            Link inválido ou incompleto. Peça um novo link na tela de{' '}
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
