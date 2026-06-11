import logoGoogle from '../assets/Google__G__logo.svg.png'

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3333'}/auth/google`

export function GoogleAuthButton() {
  return (
    <div className="flex justify-center">
      <a
        href={GOOGLE_AUTH_URL}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-md text-sm font-medium bg-[#1a1a1e] hover:bg-[#222226] text-white transition-colors"
      >
        <img src={logoGoogle} alt="Google" className="h-5 w-5" />
        Continuar com Google
      </a>
    </div>
  )
}
