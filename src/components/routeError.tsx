import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from './button'
import { NotFoundPage } from '../pages/notFoundPage'
import { StatusLink, StatusMessage } from './statusMessage'

export function RouteError() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />
  }

  return (
    <StatusMessage
      variant="error"
      title="Esta página falhou ao abrir"
      description="Foi um erro nosso, não do seu endereço. Recarregue a página. Se continuar, volte ao início."
      primaryAction={
        <Button
          variant="primary"
          size="md"
          onClick={() => window.location.reload()}
        >
          Recarregar página
        </Button>
      }
      secondaryAction={
        <StatusLink to="/" variant="outline">
          Ir para o início
        </StatusLink>
      }
    />
  )
}
