import { FaXbox } from 'react-icons/fa'
import { useXboxImport } from '../../hooks/useXboxImport'
import type { XboxAccount } from '../../types/user'
import { PlatformImportSection } from './platformImportSection'

const MAX_XBOX_ACCOUNTS = 2

export function XboxImportSection({
  xboxAccounts,
  onViewLibrary,
}: {
  xboxAccounts: XboxAccount[]
  onViewLibrary?: () => void
}) {
  const importState = useXboxImport()

  return (
    <PlatformImportSection
      icon={<FaXbox className="size-4 text-gray-300" aria-hidden="true" />}
      label="Xbox"
      masculine
      connectLabel="Entrar com a Microsoft"
      connectedId={xboxAccounts[0]?.gamertag ?? null}
      accounts={xboxAccounts.map(account => ({
        id: account.id,
        name: account.gamertag,
      }))}
      maxAccounts={MAX_XBOX_ACCOUNTS}
      disconnectedDescription="Entre com a sua conta Microsoft pra confirmar que o perfil é seu e importar os jogos do Xbox. Seu perfil e o histórico de jogos precisam estar públicos."
      importState={importState}
      onViewLibrary={onViewLibrary}
      getResultSections={result => [
        { title: 'Biblioteca', result: result.library },
      ]}
      getAccountResults={result =>
        (result.accounts ?? []).map(account => ({
          name: account.gamertag,
          result: account.library,
          error: account.error,
          warning: account.warning,
        }))
      }
    />
  )
}
