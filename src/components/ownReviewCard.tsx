import { useEffect, useId, useRef, useState } from 'react'
import { USER_GAME_STATUS_ID } from '../constants/gameStatus'
import { useAuth } from '../hooks/useAuth'
import { useGameStatus } from '../hooks/useGameStatus'
import { useHoursPlayed } from '../hooks/useHoursPlayed'
import { usePlayedCount } from '../hooks/usePlayedCount'
import { useRating } from '../hooks/useRating'
import { useReview } from '../hooks/useReview'
import { useReviewPermission } from '../hooks/useReviewPermission'
import { Button } from './button'
import { CommunityReviewCard } from './communityReviewCard'
import { ConfirmDialog } from './confirmDialog'
import { ReviewEditor } from './reviewEditor'
import { ReviewRequirement } from './reviewRequirement'
import { StatusLink } from './statusMessage'
import type { GameStatusEnum } from '../types/games'
import type { CommunityReview } from '../types/review'

const lockedPanel =
  'bg-dark-bg-light border border-dashed border-dark-border rounded-lg p-4 flex flex-col gap-3'

const editingPanel =
  'bg-dark-bg-lighter border border-primary-light rounded-lg p-4 flex flex-col gap-3'

export function OwnReviewCard({
  igdbId,
  gameName,
  releaseDate
}: {
  igdbId: string
  gameName: string
  releaseDate?: number | null
}) {
  const { user } = useAuth()
  const { review, isLoading, saveReview, deleteReview, isSaving, isDeleting } =
    useReview(igdbId)
  const {
    blockedReason,
    inLibrary,
    inBacklog,
    isLoading: isPermissionLoading
  } = useReviewPermission(igdbId, releaseDate)
  const { gameStatus } = useGameStatus(igdbId)
  const { userRating } = useRating(igdbId)
  const { hoursPlayed } = useHoursPlayed(igdbId)
  const { completions } = usePlayedCount(igdbId)
  const [editing, setEditing] = useState(false)
  const loginNoticeId = useId()
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Button é componente de função e não repassa `ref`; por isso o ref fica num wrapper
  const triggerRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef(false)
  useEffect(() => {
    if (!editing && restoreFocus.current) {
      const button = triggerRef.current?.querySelector('button')
      if (button) {
        button.focus()
        restoreFocus.current = false
      }
    }
  })

  function closeEditor() {
    restoreFocus.current = true
    setEditing(false)
  }

  async function handleSave(text: string) {
    try {
      await saveReview(text)
      closeEditor()
    } catch {
      return
    }
  }

  if (!user) {
    return (
      <section aria-labelledby="own-review-title" className={lockedPanel}>
        <h2 id="own-review-title" className="text-sm font-semibold text-white">
          Sua resenha
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p id={loginNoticeId} className="text-sm text-gray-400">
            Entre na sua conta para escrever uma resenha de {gameName}.
          </p>
          <StatusLink to="/auth?tab=login">Entrar para escrever</StatusLink>
        </div>
        <ReviewEditor
          initialText=""
          onSave={async () => undefined}
          isSaving={false}
          locked
          describedBy={loginNoticeId}
        />
      </section>
    )
  }

  if (isLoading || isPermissionLoading) {
    return (
      <div className="h-24 rounded-lg border border-dark-border bg-dark-bg-light animate-pulse" />
    )
  }

  if (!review) {
    if (blockedReason) {
      return (
        <section aria-labelledby="own-review-title" className={editingPanel}>
          <h2 id="own-review-title" className="text-sm font-semibold text-white">
            Para escrever sua resenha de {gameName}
          </h2>
          <ReviewRequirement
            reason={blockedReason}
            variant="picker"
            igdbId={igdbId}
            inLibrary={inLibrary}
            inBacklog={inBacklog}
            onPicked={() => setEditing(true)}
          />
        </section>
      )
    }

    return (
      <section aria-labelledby="own-review-title" className={editingPanel}>
        <h2 id="own-review-title" className="text-sm font-semibold text-white">
          Sua resenha
        </h2>
        <p className="text-sm text-gray-400">
          Sua nota, suas horas e as vezes que zerou aparecem junto.
        </p>
        <ReviewEditor
          initialText=""
          onSave={handleSave}
          isSaving={isSaving}
          autoFocus={editing}
        />
      </section>
    )
  }

  const ownStatusId = gameStatus?.userGameStatus?.id
  const ownStatus = Object.entries(USER_GAME_STATUS_ID).find(
    ([, id]) => id === ownStatusId
  )?.[0] as GameStatusEnum | undefined

  const own: CommunityReview = {
    userId: user.id ?? '',
    userName: user.userName ?? null,
    profilePicture: user.profilePicture || null,
    rating: userRating,
    hoursPlayed,
    completions,
    status: ownStatus ?? null,
    endless: gameStatus?.endless === true,
    text: review.text,
    createdAt: review.updatedAt
  }

  async function handleDelete() {
    try {
      await deleteReview()
      setConfirmOpen(false)
    } catch {
      return
    }
  }

  return (
    <section aria-labelledby="own-review-title" className={editingPanel}>
      <div className="flex items-center justify-between gap-3">
        <h2 id="own-review-title" className="text-sm font-semibold text-white">
          Sua resenha
        </h2>
        {!editing && (
          <div className="flex items-center gap-2">
            <div ref={triggerRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                Editar
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              Excluir
            </Button>
          </div>
        )}
      </div>

      {editing ? (
        <ReviewEditor
          initialText={review.text}
          onSave={handleSave}
          onCancel={closeEditor}
          isSaving={isSaving}
          autoFocus
        />
      ) : (
        <CommunityReviewCard review={own} expandable plain />
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Excluir resenha?"
        description="Essa ação não pode ser desfeita. Sua resenha será removida permanentemente."
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </section>
  )
}
