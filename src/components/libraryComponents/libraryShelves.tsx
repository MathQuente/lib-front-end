import { CircleX } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type {
  GameStatusEnum,
  TotalPerStatus,
  UserGamesByStatus,
} from '../../types/games'
import { type ShelfLink, type ShelfTab, StatusShelf } from './statusShelf'

const MAX_PER_SHELF = 8

const EXPLORE: ShelfLink = { to: '/games', label: 'Explorar jogos' }

type ShelfStatus = `${GameStatusEnum}`
type PlayingTab = 'PLAYING' | 'PAUSED'

function gameCount(count: number) {
  return `${count} ${count === 1 ? 'jogo' : 'jogos'}`
}

interface LibraryShelvesProps {
  games: UserGamesByStatus
  totalPerStatus: TotalPerStatus[]
  readOnly?: boolean
}

export function LibraryShelves({
  games,
  totalPerStatus,
  readOnly = false,
}: LibraryShelvesProps) {
  const [playingTab, setPlayingTab] = useState<PlayingTab>('PLAYING')

  const totalOf = (status: ShelfStatus) =>
    totalPerStatus.find(t => t.status === status)?.totalGames ??
    games[status].length

  const allLink = (status: ShelfStatus, route: string) => {
    const total = totalOf(status)
    return readOnly || total < 2
      ? undefined
      : { to: `/userLibrary/${route}`, label: 'Ver todos' }
  }

  const empty = (ownText: string) => (readOnly ? 'Nenhum jogo ainda.' : ownText)
  const explore = readOnly ? undefined : EXPLORE

  const backlogTotal = totalOf('BACKLOG')
  const playingEmptyLink =
    backlogTotal > 0
      ? {
          to: '/userLibrary/backlogGames',
          label:
            backlogTotal === 1
              ? 'Ver o jogo pendente'
              : `Escolher entre os ${backlogTotal} pendentes`,
        }
      : EXPLORE

  const pausedTotal = totalOf('PAUSED')
  const droppedTotal = totalOf('DROPPED')
  const showingPaused = playingTab === 'PAUSED' && pausedTotal > 0
  const playingTabs: ShelfTab[] | undefined =
    pausedTotal > 0
      ? [
          { key: 'PLAYING', label: 'Agora', count: totalOf('PLAYING') },
          { key: 'PAUSED', label: 'Pausados', count: pausedTotal },
        ]
      : undefined

  return (
    <div className="mt-2">
      <StatusShelf
        status="PLAYED"
        title="Zerados"
        games={games.PLAYED.slice(0, MAX_PER_SHELF)}
        summary={
          totalOf('PLAYED') === 1
            ? '1 jogo'
            : `${totalOf('PLAYED')} jogos, dos mais recentes aos mais antigos`
        }
        emptyText={empty(
          'Nenhum jogo ainda. Os que você terminar aparecem aqui.'
        )}
        allLink={allLink('PLAYED', 'playedGames')}
      />
      <StatusShelf
        status="PLAYING"
        title="Jogando"
        games={(showingPaused ? games.PAUSED : games.PLAYING).slice(
          0,
          MAX_PER_SHELF
        )}
        summary={
          showingPaused
            ? `${gameCount(pausedTotal)} para retomar`
            : `${gameCount(totalOf('PLAYING'))} em andamento`
        }
        emptyText="Nenhum jogo em andamento."
        emptyLink={readOnly ? undefined : playingEmptyLink}
        allLink={
          showingPaused
            ? allLink('PAUSED', 'pausedGames')
            : allLink('PLAYING', 'playingGames')
        }
        tabs={playingTabs}
        activeTab={showingPaused ? 'PAUSED' : 'PLAYING'}
        onTabChange={key => setPlayingTab(key as PlayingTab)}
      />
      <StatusShelf
        status="BACKLOG"
        title="Pendentes"
        games={games.BACKLOG.slice(0, MAX_PER_SHELF)}
        summary={`${gameCount(backlogTotal)} na fila para jogar`}
        emptyText={empty('Nenhum jogo ainda. Aqui fica a sua fila para jogar.')}
        emptyLink={explore}
        allLink={allLink('BACKLOG', 'backlogGames')}
      />
      <StatusShelf
        status="WISHLIST"
        title="Lista de desejos"
        games={games.WISHLIST.slice(0, MAX_PER_SHELF)}
        summary={
          readOnly
            ? gameCount(totalOf('WISHLIST'))
            : `${gameCount(totalOf('WISHLIST'))} que você ainda não tem`
        }
        emptyText={empty(
          'Nenhum jogo ainda. Aqui ficam os que você quer comprar.'
        )}
        emptyLink={explore}
        allLink={allLink('WISHLIST', 'wishlistGames')}
      />
      {!readOnly && droppedTotal > 0 && (
        <p className="flex items-center gap-2 border-t border-dark-border py-5 text-sm text-gray-400">
          <CircleX className="size-4 shrink-0 text-red-400" aria-hidden="true" />
          {droppedTotal === 1 ? '1 jogo largado' : `${droppedTotal} jogos largados`}
          <Link
            to="/userLibrary/droppedGames"
            className="rounded-sm text-primary-light transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
          >
            Ver
          </Link>
        </p>
      )}
    </div>
  )
}
