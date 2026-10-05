import { FaSteam } from 'react-icons/fa'
import { useSteamImport } from '../../hooks/useSteamImport'
import { PlatformImportSection } from './platformImportSection'

export function SteamImportSection({ steamId }: { steamId: string | null }) {
  const importState = useSteamImport()

  return (
    <PlatformImportSection
      icon={<FaSteam className="size-4 text-gray-300" aria-hidden="true" />}
      label="Steam"
      connectedId={steamId}
      disconnectedDescription="Entre com a sua conta Steam pra confirmar que ela é sua e importar sua biblioteca automaticamente."
      importState={importState}
      getResultSections={result => [
        { title: 'Biblioteca', result: result.library },
        { title: 'Lista de desejos', result: result.wishlist },
      ]}
    />
  )
}
