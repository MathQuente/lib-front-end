import dayjs from 'dayjs'

export function formatHours(hours: number) {
  return `${Number(hours.toFixed(1))}h`
}

function Cell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col px-3 py-2">
      <dt className="order-2 truncate text-xs text-gray-400">{label}</dt>
      <dd className="order-1 truncate text-base font-semibold leading-tight text-white tabular-nums">
        {value}
      </dd>
    </div>
  )
}

export function TotalsStrip({
  hours,
  completions,
  completedAt,
  hideEmptyHours = false,
  className = 'rounded-lg border border-dark-border bg-dark-bg',
}: {
  hours: number
  completions: number
  completedAt: string | null | undefined
  hideEmptyHours?: boolean
  className?: string
}) {
  const showHours = hours > 0 || !hideEmptyHours
  if (!showHours && completions === 0 && !completedAt) return null

  return (
    <dl className={`flex divide-x divide-dark-border ${className}`}>
      {showHours && <Cell value={formatHours(hours)} label="jogadas" />}
      {completions > 0 && <Cell value={`${completions}×`} label="zerado" />}
      {completedAt && (
        <Cell
          value={dayjs(completedAt).format('DD/MM/YYYY')}
          label="finalizado em"
        />
      )}
    </dl>
  )
}
