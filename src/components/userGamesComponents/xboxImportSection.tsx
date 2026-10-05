import { FaXbox } from 'react-icons/fa'
import { useXboxImport } from '../../hooks/useXboxImport'
import { PlatformImportSection } from './platformImportSection'

export function XboxImportSection({
  xboxGamertag,
}: {
  xboxGamertag: string | null
}) {
  const importState = useXboxImport()

  return (
    <PlatformImportSection
      icon={<FaXbox className="size-4 text-gray-300" aria-hidden="true" />}
      label="Xbox"
      connectedId={xboxGamertag}
      inputPlaceholder="Gamertag"
      disconnectedDescription="Conecte sua gamertag pra importar os jogos do Xbox. Seu perfil e o histórico de jogos precisam estar públicos."
      importState={importState}
      getResultSections={result => [
        { title: 'Biblioteca', result: result.library },
      ]}
    />
  )
}
