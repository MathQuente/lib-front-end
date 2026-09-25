import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useReview } from '../hooks/useReview'
import { useGameStatus } from '../hooks/useGameStatus'
import { useRating } from '../hooks/useRating'
import { USER_GAME_STATUS_ID as STATUS } from '../constants/gameStatus'
import { Button } from './button'
import { ConfirmDialog } from './confirmDialog'
import { SectionHeading } from './sectionHeading'
import { ReviewMarkdown } from './reviewMarkdown'
import type { GameCardData } from '../types/games'

const MAX_LENGTH = 2000

export function ReviewSection({ game }: { game: GameCardData }) {
  const igdbId = game.igdbId.toString()
  const { gameStatus } = useGameStatus(igdbId)
  const { userRating } = useRating(igdbId)
  const { review, saveReview, deleteReview, isSaving, isDeleting } =
    useReview(igdbId)

  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isPlayed = gameStatus?.userGameStatus?.id === STATUS.PLAYED
  const hasRating = userRating != null

  if (!isPlayed) {
    return (
      <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
        <SectionHeading>Sua resenha</SectionHeading>
        <p className="text-sm text-gray-400">
          Marque o jogo como <span className="text-gray-300">Jogado</span>{' '}
          pra poder escrever uma resenha.
        </p>
      </div>
    )
  }

  if (!hasRating && !review) {
    return (
      <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
        <SectionHeading>Sua resenha</SectionHeading>
        <p className="text-sm text-gray-400">
          Dê uma nota pro jogo antes de escrever sua resenha.
        </p>
      </div>
    )
  }

  function startEditing() {
    setText(review?.text ?? '')
    setIsEditing(true)
  }

  async function handleSave() {
    const trimmed = text.trim()
    if (!trimmed) return
    await saveReview(trimmed)
    setIsEditing(false)
  }

  function handleCancel() {
    setText(review?.text ?? '')
    setIsEditing(false)
  }

  async function handleDelete() {
    await deleteReview()
    setText('')
    setConfirmOpen(false)
    setIsEditing(false)
  }

  const showEditor = isEditing || !review

  return (
    <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
      <div className="flex items-center justify-between">
        <SectionHeading>Sua resenha</SectionHeading>
        {!showEditor && (
          <div className="flex items-center gap-1 -mt-4">
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center justify-center size-7 rounded-md text-gray-400 hover:text-primary hover:bg-dark-bg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              title="Editar resenha"
              aria-label="Editar resenha"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex items-center justify-center size-7 rounded-md text-gray-400 hover:text-red-400 hover:bg-dark-bg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              title="Excluir resenha"
              aria-label="Excluir resenha"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {showEditor ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value.slice(0, MAX_LENGTH))}
            rows={6}
            placeholder="Escreva sua resenha... (suporta markdown básico)"
            className="w-full resize-y rounded-md bg-dark-bg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {text.length}/{MAX_LENGTH}
            </span>
            <div className="flex gap-2">
              {isEditing && (
                <Button variant="cancel" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!text.trim()}
                loading={isSaving}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
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
