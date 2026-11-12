import { useId } from 'react'
import { useXboxPreferredConsole } from '../../hooks/useXboxPreferredConsole'
import { focusRing, inlineFieldFocus } from '../../styles/focus'
import type { XboxAccount, XboxPreferredConsole } from '../../types/user'
import { CONSOLE_LABELS } from '../../utils/platformConsoles'

const NOT_INFORMED = ''

const OPTIONS: { value: XboxPreferredConsole; label: string }[] = [
  { value: 'XBOX_ONE', label: CONSOLE_LABELS.XBOX_ONE },
  { value: 'XBOX_SERIES', label: CONSOLE_LABELS.XBOX_SERIES },
]

export function XboxConsoleSelect({ account }: { account: XboxAccount }) {
  const selectId = useId()
  const hintId = useId()
  const { update, isUpdating } = useXboxPreferredConsole()

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-xs text-gray-400">
        Console em que você joga
      </label>
      <select
        id={selectId}
        value={account.preferredConsole ?? NOT_INFORMED}
        onChange={event =>
          update({
            accountId: account.id,
            preferredConsole:
              (event.target.value as XboxPreferredConsole) || null,
          })
        }
        disabled={isUpdating}
        aria-describedby={hintId}
        className={`w-full min-h-11 rounded-md bg-dark-bg px-2 py-1 text-sm text-white ${inlineFieldFocus} disabled:opacity-50`}
      >
        {OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        <option value={NOT_INFORMED}>Não informar</option>
      </select>
      <p id={hintId} className="text-xs text-gray-400">
        Vale na próxima importação e só preenche jogos sem console.
      </p>
      <details className="text-xs text-gray-400">
        <summary
          className={`w-fit cursor-pointer rounded-sm text-primary-link underline underline-offset-4 ${focusRing}`}
        >
          Saiba mais
        </summary>
        <div className="mt-1 flex flex-col gap-1">
          <p>
            Jogos que já têm console não mudam. Para corrigir um, edite o
            console do jogo.
          </p>
          <p>
            Jogos que também rodam no Xbox 360 ficam sem console de propósito.
          </p>
        </div>
      </details>
    </div>
  )
}
