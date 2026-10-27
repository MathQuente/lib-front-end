import logoGoogle from '../assets/Google__G__logo.svg.png'
import { OAuthButton, type OAuthButtonProps } from './oauthButton'

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3333'}/auth/google`

export function GoogleAuthButton(props: OAuthButtonProps) {
  return (
    <OAuthButton
      {...props}
      url={GOOGLE_AUTH_URL}
      logo={logoGoogle}
      provider="Google"
    />
  )
}
