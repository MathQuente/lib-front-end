import type {
  GameStatusEnum,
  TotalPerStatus,
  UserGamesByStatus,
} from '../../types/games'
import { type ShelfLink, StatusShelf } from './statusShelf'

const MAX_PLAYING = 3
const MAX_PER_SHELF = 8

const EXPLORE: ShelfLink = { to: '/games', label: 'Explorar jogos' }

type ShelfStatus = `${GameStatusEnum}`

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
        featured
        games={games.PLAYING.slice(0, MAX_PLAYING)}
        summary={`${gameCount(totalOf('PLAYING'))} em andamento`}
        emptyText="Nenhum jogo em andamento."
        emptyLink={readOnly ? undefined : playingEmptyLink}
        allLink={allLink('PLAYING', 'playingGames')}
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
    </div>
  )
}
