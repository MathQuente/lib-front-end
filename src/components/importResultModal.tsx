import * as Dialog from '@radix-ui/react-dialog'
import type { ImportJobStatus, ImportSectionResult } from '../types/import'
import { Button } from './button'

export interface ImportResultSection {
  title: string
  result: ImportSectionResult
}

function ResultSection({ title, result }: ImportResultSection) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400 uppercase tracking-widest">{title}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span className="text-gray-300">
          <span className="text-white font-semibold">{result.imported}</span>{' '}
          importados
        </span>
        {result.updated > 0 && (
          <span className="text-gray-300">
            <span className="text-white font-semibold">{result.updated}</span>{' '}
            atualizados
          </span>
        )}
        {result.skipped > 0 && (
          <span className="text-gray-300">
            <span className="text-white font-semibold">{result.skipped}</span>{' '}
            já estavam na sua lib
          </span>
        )}
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

export function ImportResultModal({
  open,
  onOpenChange,
  platformLabel,
  status,
  error,
  sections,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  platformLabel: string
  status: ImportJobStatus | undefined
  error?: string
  sections: ImportResultSection[]
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 inset-0 fixed z-40" />
        <Dialog.Content className="w-[calc(100vw-2rem)] max-w-[420px] fixed bg-dark-bg-lighter text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg z-50 p-5 flex flex-col gap-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <Dialog.Title className="text-white font-semibold">
            {status === 'failed'
              ? `Erro ao importar da ${platformLabel}`
              : `Importação da ${platformLabel} concluída`}
          </Dialog.Title>

          {status === 'failed' ? (
            <p className="text-sm text-gray-300">
              {error ?? 'Erro desconhecido ao importar sua biblioteca.'}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {sections.map(section => (
                <ResultSection key={section.title} {...section} />
              ))}
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
