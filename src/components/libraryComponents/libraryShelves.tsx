import { ChevronRight, CircleX } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type {
  GameStatusEnum,
  TotalPerStatus,
  UserGameEntry,
  UserGamesByStatus,
} from '../../types/games'
import { type ShelfLink, type ShelfTab, StatusShelf } from './statusShelf'

const MAX_PER_SHELF = 8

const EXPLORE: ShelfLink = { to: '/games', label: 'Explorar jogos' }

type ShelfStatus = `${GameStatusEnum}`
type PlayingTab = 'NOW' | 'ENDLESS' | 'PAUSED'

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
  const [playingTab, setPlayingTab] = useState<PlayingTab>('NOW')

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
              ? 'Ver o jogo da fila'
              : `Escolher entre os ${backlogTotal} da fila`,
        }
      : EXPLORE

  const pausedTotal = totalOf('PAUSED')
  const droppedTotal = totalOf('DROPPED')

  const nowGames = games.PLAYING.filter(game => !game.endless)
  const endlessGames = games.PLAYING.filter(game => game.endless)
  // No perfil público a lista de cada status vem cortada, então a contagem
  // por marca só é confiável quando todos os jogos em andamento vieram.
  const playingComplete = totalOf('PLAYING') <= games.PLAYING.length

  const playingShelves: Record<
    PlayingTab,
    { label: string; games: UserGameEntry[]; count?: number; summary: string }
  > = {
    NOW: {
      label: 'Agora',
      games: nowGames,
      count: playingComplete ? nowGames.length : undefined,
      summary: playingComplete
        ? `${gameCount(nowGames.length)} em andamento`
        : 'Em andamento',
    },
    ENDLESS: {
      label: 'Sempre jogando',
      games: endlessGames,
      count: playingComplete ? endlessGames.length : undefined,
      summary: playingComplete
        ? `${gameCount(endlessGames.length)} sem fim`
        : 'Jogos sem fim',
    },
    PAUSED: {
      label: 'Pausados',
      games: games.PAUSED,
      count: pausedTotal,
      summary: `${gameCount(pausedTotal)} para retomar`,
    },
  }
  const availableTabs = (['NOW', 'ENDLESS', 'PAUSED'] as const).filter(key =>
    key === 'PAUSED'
      ? pausedTotal > 0
      : playingShelves[key].games.length > 0
  )
  const activeTab: PlayingTab = availableTabs.includes(playingTab)
    ? playingTab
    : (availableTabs[0] ?? 'NOW')
  const activeShelf = playingShelves[activeTab]
  const playingTabs: ShelfTab[] | undefined =
    availableTabs.length > 1
      ? availableTabs.map(key => ({
          key,
          label: playingShelves[key].label,
          count: playingShelves[key].count,
        }))
      : undefined

  return (
    <div className="mt-2">
      <StatusShelf
        status="PLAYED"
        title="Zerados"
        games={games.PLAYED.slice(0, MAX_PER_SHELF)}
        summary={
          readOnly
            ? `${gameCount(totalOf('PLAYED'))} zerados`
            : `${gameCount(totalOf('PLAYED'))} que você já zerou`
        }
        emptyText={empty(
          'Nenhum jogo ainda. Os que você terminar aparecem aqui.'
        )}
        allLink={allLink('PLAYED', 'playedGames')}
      />
      <StatusShelf
        status="PLAYING"
        title="Jogando"
        games={activeShelf.games.slice(0, MAX_PER_SHELF)}
        summary={activeShelf.summary}
        emptyText="Nenhum jogo em andamento."
        emptyLink={readOnly ? undefined : playingEmptyLink}
        allLink={
          activeTab === 'PAUSED'
            ? allLink('PAUSED', 'pausedGames')
            : allLink('PLAYING', 'playingGames')
        }
        tabs={playingTabs}
        activeTab={activeTab}
        onTabChange={key => setPlayingTab(key as PlayingTab)}
      />
      <StatusShelf
        status="BACKLOG"
        title="Na fila"
        games={games.BACKLOG.slice(0, MAX_PER_SHELF)}
        summary={`${gameCount(backlogTotal)} esperando a vez`}
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
            className="-my-3 inline-flex min-h-11 items-center gap-0.5 rounded-sm text-gray-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
          >
            Ver
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </p>
      )}
    </div>
  )
}
