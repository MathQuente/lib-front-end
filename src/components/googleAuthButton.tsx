import logoGoogle from '../assets/Google__G__logo.svg.png'

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3333'}/auth/google`

export function GoogleAuthButton() {
  return (
    <a
      href={GOOGLE_AUTH_URL}
      className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-dark-border rounded-md text-sm font-medium bg-dark-card hover:bg-dark-bg-light text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
    >
      <img src={logoGoogle} alt="Google" className="h-5 w-5" />
      Continuar com Google
    </a>
  )
}
