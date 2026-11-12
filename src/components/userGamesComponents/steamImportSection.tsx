import { FaSteam } from 'react-icons/fa'
import { useSteamImport } from '../../hooks/useSteamImport'
import type { SteamAccount } from '../../types/user'
import { PlatformImportSection } from './platformImportSection'

const MAX_STEAM_ACCOUNTS = 2

const ADD_ACCOUNT_HINT =
  'A Steam reaproveita a sessão deste navegador. Se abrir a conta errada, saia da Steam aqui (ou use uma janela privada) e tente de novo.'

export function SteamImportSection({
  steamAccounts,
  onViewLibrary,
}: {
  steamAccounts: SteamAccount[]
  onViewLibrary?: () => void
}) {
  const importState = useSteamImport()

  return (
    <PlatformImportSection
      icon={<FaSteam className="size-4 text-gray-300" aria-hidden="true" />}
      label="Steam"
      connectedId={steamAccounts[0]?.steamId ?? null}
      connectedName={steamAccounts[0]?.personaName ?? null}
      hideConnectedId
      accounts={steamAccounts.map(account => ({
        id: account.id,
        name: account.personaName,
      }))}
      maxAccounts={MAX_STEAM_ACCOUNTS}
      addAccountHint={ADD_ACCOUNT_HINT}
      disconnectedDescription="Entre com a sua conta Steam pra confirmar que ela é sua e importar sua biblioteca automaticamente."
      importState={importState}
      onViewLibrary={onViewLibrary}
      suggestionsPlatform="STEAM"
      getResultSections={result => [
        { title: 'Biblioteca', result: result.library },
        { title: 'Lista de desejos', result: result.wishlist },
      ]}
      getAccountResults={result =>
        (result.accounts ?? []).map(account => ({
          name: account.displayName,
          result: account.library,
          error: account.error,
        }))
      }
    />
  )
}
