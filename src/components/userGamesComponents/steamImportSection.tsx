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
      inputPlaceholder="Link do perfil ou SteamID"
      disconnectedDescription="Conecte sua conta pra importar sua biblioteca automaticamente."
      importState={importState}
      getResultSections={result => [
        { title: 'Biblioteca', result: result.library },
        { title: 'Lista de desejos', result: result.wishlist },
      ]}
    />
  )
}
