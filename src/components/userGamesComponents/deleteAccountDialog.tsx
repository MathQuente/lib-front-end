import { useId, useState } from 'react'
import { fieldFocus, fieldFocusError } from '../../styles/focus'
import { ConfirmDialog } from '../confirmDialog'

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
  const inputId = useId()
  const hintId = useId()
  const matches = typed.trim() === confirmationText

  const handleOpenChange = (next: boolean) => {
    if (!next) setTyped('')
    onOpenChange(next)
  }

  const handleChange = (value: string) => {
    setTyped(value)
    if (errorMessage) onEdit()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Excluir sua conta?"
      description={
        <div className="flex flex-col gap-2">
          <p>Isso é imediato e não dá para desfazer. Serão apagados:</p>
          <ul className="list-disc pl-5 text-gray-300">
            {CONSEQUENCES.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      }
      confirmLabel={needsReauth ? 'Sair e entrar de novo' : 'Excluir conta'}
      confirmVariant={needsReauth ? 'primary' : 'danger'}
      onConfirm={needsReauth ? onReauth : onConfirm}
      isLoading={needsReauth ? false : isLoading}
      confirmDisabled={needsReauth ? false : !matches}
      lockWhileLoading
    >
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
    </ConfirmDialog>
  )
}
