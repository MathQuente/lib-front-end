import { Link } from 'react-router-dom'
import type { ReviewBlockedReason } from '../hooks/useReviewPermission'
import { focusRing } from '../styles/focus'
import { ReviewStatusPicker } from './reviewStatusPicker'

export function ReviewRequirement({
  reason,
  variant,
  igdbId,
  inLibrary,
  inBacklog = false,
  onPicked
}: {
  reason: ReviewBlockedReason
  // 'link': aponta para os botões de status da própria página; 'picker': escolhe o status ali mesmo
  variant: 'link' | 'picker'
  igdbId: string
  inLibrary: boolean
  inBacklog?: boolean
  onPicked?: () => void
}) {
  if (reason === 'unreleased') {
    return (
      <p className="text-sm text-gray-400">
        Este jogo ainda não foi lançado. Você poderá escrever a resenha depois
        do lançamento.
      </p>
    )
  }

  if (variant === 'picker') {
    return (
      <ReviewStatusPicker
        igdbId={igdbId}
        inLibrary={inLibrary}
        inBacklog={inBacklog}
        onPicked={onPicked}
      />
    )
  }

  return (
    <p className="text-sm text-gray-400">
      Resenhas são de jogos que você já começou.{' '}
      {inBacklog
        ? 'Escolha o status ou registre horas ou uma finalização em'
        : 'Escolha o status em'}{' '}
      <Link
        to="#biblioteca"
        className={`text-primary-link hover:text-white transition-colors rounded-sm ${focusRing}`}
      >
        Minha biblioteca
      </Link>
      .
    </p>
  )
}
