import * as Dialog from '@radix-ui/react-dialog'
import { useId, useRef, useState } from 'react'
import { fieldFocus, fieldFocusError } from '../../styles/focus'
import { Button } from '../button'

const CONSEQUENCES = [
  'Biblioteca, horas e conclusões',
  'Resenhas e notas',
  'Seguidores e quem você segue',
  'Vínculos com Steam, Xbox e PSN'
]

export function DeleteAccountDialog({
  open,
  onOpenChange,
  confirmationText,
  onConfirm,
  onEdit,
  onReauth,
  isLoading,
  needsReauth,
  errorMessage
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  confirmationText: string
  onConfirm: () => void
  onEdit: () => void
  onReauth: () => void
  isLoading: boolean
  needsReauth: boolean
  errorMessage: string | null
}) {
  const [typed, setTyped] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const inputId = useId()
  const hintId = useId()
  const matches = typed.trim() === confirmationText

  const handleOpenChange = (next: boolean) => {
    if (isLoading) return
    if (!next) setTyped('')
    onOpenChange(next)
  }

  const handleChange = (value: string) => {
    setTyped(value)
    if (errorMessage) onEdit()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 inset-0 fixed z-confirm" />
        <Dialog.Content
          ref={contentRef}
          onOpenAutoFocus={event => {
            event.preventDefault()
            contentRef.current
              ?.querySelector<HTMLButtonElement>('[data-cancel]')
              ?.focus()
          }}
          className="w-[calc(100vw-2rem)] max-w-[380px] fixed bg-dark-bg-lighter text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg z-confirm-content p-5 flex flex-col gap-4"
        >
          <Dialog.Title className="text-white font-semibold">
            Excluir sua conta?
          </Dialog.Title>
          <Dialog.Description asChild>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <p>Isso é imediato e não dá para desfazer. Serão apagados:</p>
              <ul className="list-disc pl-5 text-gray-300">
                {CONSEQUENCES.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Dialog.Description>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={inputId} className="text-sm text-gray-300">
              Para confirmar, digite{' '}
              <strong className="text-white break-all">{confirmationText}</strong>
            </label>
            <input
              id={inputId}
              type="text"
              value={typed}
              onChange={event => handleChange(event.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={isLoading}
              aria-describedby={hintId}
              aria-invalid={errorMessage ? true : undefined}
              className={`bg-dark-bg-darker text-white rounded-lg block w-full text-sm py-3 px-3 border ${
                errorMessage ? `border-red-400 ${fieldFocusError}` : `border-dark-border ${fieldFocus}`
              } transition-colors duration-150`}
            />
            {errorMessage ? (
              <span
                id={hintId}
                aria-live="assertive"
                className="text-[13px] leading-snug text-red-400"
              >
                {errorMessage}
              </span>
            ) : (
              <span id={hintId} className="text-xs text-gray-400">
                O botão só liga quando o texto for idêntico.
              </span>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button variant="secondary" data-cancel disabled={isLoading}>
                Cancelar
              </Button>
            </Dialog.Close>
            {needsReauth ? (
              <Button variant="primary" onClick={onReauth}>
                Sair e entrar de novo
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={onConfirm}
                loading={isLoading}
                disabled={!matches}
              >
                Excluir conta
              </Button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
