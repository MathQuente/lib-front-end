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
      connectLabel="Entrar com a Microsoft"
      connectedId={xboxGamertag}
      disconnectedDescription="Entre com a sua conta Microsoft pra confirmar que o perfil é seu e importar os jogos do Xbox. Seu perfil e o histórico de jogos precisam estar públicos."
      importState={importState}
      getResultSections={result => [
        { title: 'Biblioteca', result: result.library },
      ]}
    />
  )
}
