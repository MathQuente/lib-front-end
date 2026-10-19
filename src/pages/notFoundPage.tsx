import { BackButton } from '../components/backButton'
import { StatusLink, StatusMessage } from '../components/statusMessage'

export function NotFoundPage() {
  return (
    <>
      <BackButton className="mt-4" />
      <StatusMessage
        variant="not-found"
        title="Página não encontrada"
        description="Confira se o endereço está certo. Se você chegou por um link, ele pode estar desatualizado."
        showSearch
        shortcuts={[
          { to: '/games', label: 'Jogos' },
          { to: '/games/comingSoon', label: 'Em breve' },
          { to: '/userLibrary', label: 'Minha biblioteca' }
        ]}
        primaryAction={<StatusLink to="/">Ir para o início</StatusLink>}
      />
    </>
  )
}
