import { useEffect, useRef, useState } from 'react'
import { Button } from './button'

const MAX_LENGTH = 2000

export function ReviewEditor({
  initialText,
  onSave,
  onCancel,
  isSaving,
  autoFocus,
  locked = false,
  describedBy
}: {
  initialText: string
  onSave: (text: string) => Promise<void>
  onCancel?: () => void
  isSaving: boolean
  autoFocus?: boolean
  locked?: boolean
  describedBy?: string
}) {
  const [text, setText] = useState(initialText)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus()
  }, [autoFocus])

  async function handleSave() {
    const trimmed = text.trim()
    if (!trimmed) return
    await onSave(trimmed)
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={e => setText(e.target.value.slice(0, MAX_LENGTH))}
        rows={6}
        disabled={locked}
        aria-describedby={describedBy}
        aria-label="Texto da resenha"
        placeholder={
          locked
            ? 'Entre na sua conta para escrever'
            : 'Escreva sua resenha... (suporta markdown básico)'
        }
        className={`w-full resize-y rounded-md bg-dark-bg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${locked ? 'opacity-60 cursor-not-allowed resize-none disabled:cursor-not-allowed' : ''}`}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {text.length}/{MAX_LENGTH}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={locked || !text.trim()}
            loading={isSaving}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}
