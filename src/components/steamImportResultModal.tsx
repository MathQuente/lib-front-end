import * as Dialog from '@radix-ui/react-dialog'
import { Button } from './button'
import type { ImportStatusResponse, SteamImportSectionResult } from '../types/steam'

function ResultSection({
  title,
  result
}: {
  title: string
  result: SteamImportSectionResult
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400 uppercase tracking-widest">
        {title}
      </p>
      <div className="flex gap-4 text-sm">
        <span className="text-gray-300">
          <span className="text-white font-semibold">{result.imported}</span>{' '}
          importados
        </span>
        <span className="text-gray-300">
          <span className="text-white font-semibold">{result.skipped}</span>{' '}
          já estavam na sua lib
        </span>
      </div>

      {result.notFound.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-gray-500">
            Não encontrados ({result.notFound.length})
          </p>
          <ul className="text-sm text-gray-300 max-h-32 overflow-y-auto flex flex-col gap-1 list-disc list-inside">
            {result.notFound.map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function SteamImportResultModal({
  open,
  onOpenChange,
  status
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  status: ImportStatusResponse | undefined
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 inset-0 fixed z-40" />
        <Dialog.Content className="w-[calc(100vw-2rem)] max-w-[420px] fixed bg-dark-bg-lighter text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg z-50 p-5 flex flex-col gap-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <Dialog.Title className="text-white font-semibold">
            {status?.status === 'failed'
              ? 'Erro ao importar da Steam'
              : 'Importação da Steam concluída'}
          </Dialog.Title>

          {status?.status === 'failed' ? (
            <p className="text-sm text-gray-300">
              {status.error ?? 'Erro desconhecido ao importar sua biblioteca.'}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {status?.result && (
                <>
                  <ResultSection title="Biblioteca" result={status.result.library} />
                  <ResultSection title="Lista de desejos" result={status.result.wishlist} />
                </>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Dialog.Close asChild>
              <Button variant="primary">Fechar</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
