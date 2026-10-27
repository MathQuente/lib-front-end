import logoDiscord from '../assets/5968756.png'
import { OAuthButton, type OAuthButtonProps } from './oauthButton'

const DISCORD_AUTH_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3333'}/auth/discord`

export function DiscordAuthButton(props: OAuthButtonProps) {
  return (
    <OAuthButton
      {...props}
      url={DISCORD_AUTH_URL}
      logo={logoDiscord}
      provider="Discord"
    />
  )
}
