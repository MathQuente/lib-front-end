import { focusRing } from '../styles/focus'

const baseClasses = `flex items-center justify-center gap-2 w-full px-4 py-3 max-sm:min-h-11 border border-dark-border rounded-md text-sm font-medium bg-dark-card text-white transition-colors ${focusRing}`

export interface OAuthButtonProps {
  acceptedTerms?: boolean
  disabled?: boolean
  describedBy?: string
}

export function OAuthButton({
  url,
  logo,
  provider,
  acceptedTerms = false,
  disabled = false,
  describedBy,
}: OAuthButtonProps & { url: string; logo: string; provider: string }) {
  const content = (
    <>
      <img src={logo} alt="" className="h-5 w-5" />
      Continuar com {provider}
    </>
  )

  if (disabled) {
    return (
      <button
        type="button"
        aria-disabled="true"
        aria-describedby={describedBy}
        className={`${baseClasses} opacity-50 cursor-not-allowed`}
      >
        {content}
      </button>
    )
  }

  return (
    <a
      href={acceptedTerms ? `${url}?acceptedTerms=true` : url}
      className={`${baseClasses} hover:bg-dark-bg-light`}
    >
      {content}
    </a>
  )
}
