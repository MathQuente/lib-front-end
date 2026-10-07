import { Link } from 'react-router-dom'
import type { TotalPerStatus } from '../../types/games'
import { textLink } from './styles'

const SUMMARY_PARTS = [
  { status: 'PLAYED', one: 'zerado', many: 'zerados' },
  { status: 'PLAYING', one: 'jogando', many: 'jogando' },
  { status: 'BACKLOG', one: 'pendente', many: 'pendentes' },
  {
    status: 'WISHLIST',
    one: 'na lista de desejos',
    many: 'na lista de desejos',
  },
]

function joinParts(parts: string[]) {
  if (parts.length < 2) return parts.join('')
  return `${parts.slice(0, -1).join(', ')} e ${parts[parts.length - 1]}`
}

export function LibrarySummary({
  totalPerStatus,
}: {
  totalPerStatus: TotalPerStatus[]
}) {
  const parts = SUMMARY_PARTS.flatMap(({ status, one, many }) => {
    const count = totalPerStatus.find(t => t.status === status)?.totalGames ?? 0
    return count > 0 ? [`${count} ${count === 1 ? one : many}`] : []
  })

  return (
    <div className="mt-10 flex flex-col items-start gap-2 border-t border-dark-border pt-4 lg:flex-row lg:items-baseline lg:justify-between lg:gap-8">
      {parts.length > 0 && <p className="text-gray-200">{joinParts(parts)}.</p>}
      <Link to="/userLibrary" className={textLink}>
        Abrir biblioteca
      </Link>
    </div>
  )
}
