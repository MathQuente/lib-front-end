import { ChevronRight } from 'lucide-react'
import { type ReactNode, useId, useState } from 'react'
import { toast } from 'react-toastify'
import type { ImportSectionResult } from '../types/import'
import { groupNotFound } from '../utils/groupNotFound'
import { Button } from './button'
import { focusRing } from '../styles/focus'

export interface ImportResultSection {
  title: string
  result: ImportSectionResult
}

interface ImportResultSummaryProps {
  platformLabelOf: string
  sections: ImportResultSection[]
  variant: 'fresh' | 'last'
  finishedAt?: number
}

const SUPPORT_LABELS: Record<string, string> = {
  'Lista de desejos': 'na lista de desejos',
}

function plural(count: number, one: string, many: string) {
  return count === 1 ? one : many
}

function formatWhen(timestamp: number) {
  const date = new Date(timestamp)
  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const sameDay = date.toDateString() === new Date().toDateString()
  if (sameDay) return `hoje, ${time}`
  const day = date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
  })
  return `${day}, ${time}`
}

function Count({ children }: { children: number }) {
  return <b className="font-bold text-white tabular-nums">{children}</b>
}

export function ImportResultSummary({
  platformLabelOf,
  sections,
  variant,
  finishedAt,
}: ImportResultSummaryProps) {
  const [expanded, setExpanded] = useState(false)
  const detailId = useId()

  const [library, ...others] = sections
  if (!library) return null

  const { imported, updated, skipped } = library.result
  const notFound = Array.from(
    new Set(sections.flatMap(section => section.result.notFound))
  )
  const groups = groupNotFound(notFound)
  const missing = notFound.length

  const support: { key: string; node: ReactNode }[] = []
  for (const section of others) {
    support.push({
      key: section.title,
      node: (
        <>
          <Count>{section.result.imported}</Count>{' '}
          {SUPPORT_LABELS[section.title] ?? `em ${section.title.toLowerCase()}`}
        </>
      ),
    })
  }
  if (updated > 0) {
    support.push({
      key: 'updated',
      node: (
        <>
          <Count>{updated}</Count>{' '}
          {plural(updated, 'atualizado', 'atualizados')}
        </>
      ),
    })
  }
  if (skipped > 0) {
    support.push({
      key: 'skipped',
      node: (
        <>
          <Count>{skipped}</Count>{' '}
          {plural(
            skipped,
            'já estava na biblioteca',
            'já estavam na biblioteca'
          )}
        </>
      ),
    })
  }

  async function copyList() {
    try {
      await navigator.clipboard.writeText(notFound.join('\n'))
      toast.success('Lista copiada')
    } catch {
      toast.error('Não foi possível copiar a lista')
    }
  }

  const supportLine =
    support.length > 0 ? (
      <p className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-gray-300">
        {support.map((part, index) => (
          <span key={part.key} className="flex gap-2">
            {index > 0 && <span aria-hidden="true">·</span>}
            <span>{part.node}</span>
          </span>
        ))}
      </p>
    ) : null

  const toggleLabel =
    variant === 'last'
      ? expanded
        ? 'Ocultar detalhes'
        : 'Ver detalhes'
      : `${missing} sem correspondência no catálogo`

  const details = (
    <div id={detailId} className="flex flex-col gap-3 pt-1">
      {variant === 'last' && supportLine}
      {skipped > 0 && (
        <p className="text-xs text-gray-400">
          Se algum jogo seu tem mais de um console da mesma plataforma, a
          importação não o atualiza e ele entra nessa contagem. Ajuste as horas
          direto no jogo.
        </p>
      )}
      {missing > 0 && (
        <>
          <p className="text-xs text-gray-400">
            Betas, testes, ferramentas e itens removidos {platformLabelOf}{' '}
            costumam não ter ficha no catálogo de jogos.
          </p>
          {groups.map(group => (
            <div key={group.key} className="flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-300">
                {group.label} ({group.items.length})
              </p>
              <ul className="flex flex-col text-xs text-gray-300">
                {group.items.map(item => (
                  <li
                    key={item.name}
                    className="flex items-baseline justify-between gap-3 border-t border-dark-border py-1 first:border-t-0"
                  >
                    <span className="min-w-0 break-words">{item.name}</span>
                    {item.appId !== undefined && (
                      <a
                        href={`https://store.steampowered.com/app/${item.appId}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`shrink-0 rounded-sm text-primary-light hover:underline ${focusRing}`}
                      >
                        Ver na loja
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="[@media(max-width:480px)]:w-full"
              onClick={copyList}
            >
              Copiar lista
            </Button>
          </div>
        </>
      )}
    </div>
  )

  const toggle = (
    <button
      type="button"
      onClick={() => setExpanded(value => !value)}
      aria-expanded={expanded}
      aria-controls={expanded ? detailId : undefined}
      className={`flex w-full items-center justify-between gap-3 rounded-md border border-dark-border bg-dark-bg-light px-3 py-2 text-left text-sm text-white transition-colors hover:bg-dark-bg-lighter ${focusRing}`}
    >
      <span className="flex min-w-0 items-center gap-2">
        {variant === 'fresh' && (
          <span
            className="size-2 shrink-0 rounded-full bg-amber-400"
            aria-hidden="true"
          />
        )}
        {toggleLabel}
      </span>
      <ChevronRight
        className={`size-4 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none ${expanded ? 'rotate-90' : ''}`}
        aria-hidden="true"
      />
    </button>
  )

  if (variant === 'last') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-300">
          Última importação{finishedAt ? `, ${formatWhen(finishedAt)}` : ''}:{' '}
          <Count>{imported}</Count>{' '}
          {plural(imported, 'jogo novo', 'jogos novos')}
          {missing > 0 && (
            <>
              {' · '}
              <Count>{missing}</Count> sem correspondência
            </>
          )}
        </p>
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={expanded}
            aria-controls={expanded ? detailId : undefined}
            onClick={() => setExpanded(value => !value)}
          >
            {toggleLabel}
          </Button>
        </div>
        {expanded && details}
      </div>
    )
  }

  const headline =
    imported > 0 ? (
      <>
        <span className="text-green-400">{imported}</span>{' '}
        {plural(imported, 'jogo entrou', 'jogos entraram')} na sua biblioteca
      </>
    ) : (
      'Nenhum jogo novo'
    )

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-balance text-xl font-bold leading-tight text-white tabular-nums">
        {headline}
      </p>
      {supportLine}
      {missing > 0 ? (
        <>
          {toggle}
          {expanded && details}
        </>
      ) : (
        <p className="text-xs text-gray-300">Nada ficou de fora.</p>
      )}
    </div>
  )
}
