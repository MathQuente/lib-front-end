import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useReview } from '../hooks/useReview'
import { useReviewPermission } from '../hooks/useReviewPermission'
import { ConfirmDialog } from './confirmDialog'
import { IconButton } from './iconButton'
import { ReviewEditor } from './reviewEditor'
import { ReviewRequirement } from './reviewRequirement'
import { SectionHeading } from './sectionHeading'
import { ReviewMarkdown } from './reviewMarkdown'
import type { GameCardData } from '../types/games'

export function ReviewSection({ game }: { game: GameCardData }) {
  const igdbId = game.igdbId.toString()
  const {
    blockedReason,
    inLibrary,
    inBacklog,
    isLoading: isPermissionLoading
  } = useReviewPermission(igdbId, game.releaseDate)
  const { review, saveReview, deleteReview, isSaving, isDeleting } =
    useReview(igdbId)

  const [isEditing, setIsEditing] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isPermissionLoading) {
    return (
      <div className="h-24 rounded-lg border border-dark-border bg-dark-bg-light animate-pulse" />
    )
  }

  if (blockedReason) {
    return (
      <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
        <SectionHeading>Sua resenha</SectionHeading>
        <ReviewRequirement
          reason={blockedReason}
          variant="link"
          igdbId={igdbId}
          inLibrary={inLibrary}
          inBacklog={inBacklog}
        />
      </div>
    )
  }

  async function handleSave(text: string) {
    try {
      await saveReview(text)
      setIsEditing(false)
    } catch {
      return
    }
  }

  async function handleDelete() {
    try {
      await deleteReview()
      setConfirmOpen(false)
      setIsEditing(false)
    } catch {
      return
    }
  }

  const showEditor = isEditing || !review

  return (
    <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
      <div className="flex items-center justify-between">
        <SectionHeading>Sua resenha</SectionHeading>
        {!showEditor && (
          <div className="flex items-center gap-1 -mt-4">
            <IconButton
              variant="bare"
              onClick={() => setIsEditing(true)}
              title="Editar resenha"
              aria-label="Editar resenha"
            >
              <Pencil className="size-3.5" />
            </IconButton>
            <IconButton
              variant="bare"
              tone="danger"
              onClick={() => setConfirmOpen(true)}
              title="Excluir resenha"
              aria-label="Excluir resenha"
            >
              <Trash2 className="size-3.5" />
            </IconButton>
          </div>
        )}
      </div>

      {showEditor ? (
        <ReviewEditor
          initialText={review?.text ?? ''}
          onSave={handleSave}
          onCancel={isEditing ? () => setIsEditing(false) : undefined}
          isSaving={isSaving}
        />
      ) : (
        <div className="text-sm text-gray-300">
          <ReviewMarkdown text={review.text} />
        </div>
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
    </div>
  )
}
