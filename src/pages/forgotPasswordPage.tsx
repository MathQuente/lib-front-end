import { FormForgotPassword } from '../components/formForgotPassword'

export function ForgotPasswordPage() {
  return (
    <div className="flex justify-center pt-2 pb-8 md:pt-4 md:pb-12">
      <div className="w-full max-w-md">
        <h1 className="text-white font-semibold text-lg mb-6">
          Esqueceu a senha?
        </h1>
        <FormForgotPassword />
      </div>
    </div>
  )
}
