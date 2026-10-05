import { FaPlaystation } from 'react-icons/fa'
import { usePsnImport } from '../../hooks/usePsnImport'
import { PlatformImportSection } from './platformImportSection'

export function PsnImportSection({
  psnOnlineId,
}: {
  psnOnlineId: string | null
}) {
  const importState = usePsnImport()

  return (
    <PlatformImportSection
      icon={
        <FaPlaystation className="size-4 text-gray-300" aria-hidden="true" />
      }
      label="PlayStation"
      connectedId={psnOnlineId}
      inputPlaceholder="ID online da PSN"
      verificationHint='Pra confirmar que o perfil é seu, cole este código no "Sobre mim" do seu perfil da PSN, salve e clique em Verificar. Depois de conectar você pode apagá-lo. O código vale por 15 minutos.'
      disconnectedDescription="Conecte seu ID da PSN pra importar os jogos de PS4 e PS5. Seu histórico de jogos e troféus precisa estar visível para todos."
      importState={importState}
      getResultSections={result => [
        { title: 'Biblioteca', result: result.library },
      ]}
    />
  )
}
