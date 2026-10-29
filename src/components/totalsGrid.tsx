import dayjs from 'dayjs'
import { NO_HOURS_LABEL, formatHours } from '../utils/hours'

function Cell({
  value,
  label,
  fit = false,
}: {
  value: string
  label: string
  fit?: boolean
}) {
  return (
    <div
      className={`flex min-w-0 flex-col px-3 py-2 ${fit ? 'shrink-0' : 'flex-1'}`}
    >
      <dt className="order-2 truncate text-xs text-gray-400">{label}</dt>
      <dd
        className={`order-1 text-base font-semibold leading-tight text-white tabular-nums ${fit ? 'whitespace-nowrap' : 'truncate'}`}
      >
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
  noHours = false,
  className = 'rounded-lg border border-dark-border bg-dark-bg',
}: {
  hours: number
  completions: number
  completedAt: string | null | undefined
  hideEmptyHours?: boolean
  noHours?: boolean
  className?: string
}) {
  const showHours = hours > 0 || !hideEmptyHours
  if (!showHours && completions === 0 && !completedAt) return null

  return (
    <dl className={`flex divide-x divide-dark-border ${className}`}>
      {showHours &&
        (noHours ? (
          <Cell value="—" label={NO_HOURS_LABEL} />
        ) : (
          <Cell value={formatHours(hours)} label="jogadas" />
        ))}
      {completions > 0 && <Cell value={`${completions}×`} label="zerado" />}
      {completedAt && (
        <Cell
          value={dayjs(completedAt).format('DD/MM/YYYY')}
          label="finalizado em"
          fit
        />
      )}
    </dl>
  )
}
