import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { USER_GAME_STATUS_ID as STATUS } from '../../constants/gameStatus'
import { useAddGame } from '../../hooks/useAddGame'
import { useGameStatus } from '../../hooks/useGameStatus'
import type {
  GameCardData,
  GameToDisplayResponse,
  UserGameEntry,
} from '../../types/games'
import { Button } from '../button'
import { GameCard } from '../gamesComponents/gameCard'
import { coverLink, sectionTitle, textLink } from './styles'

const QUEUE_SIZE = 3

function StartPlayingButton({
  igdbId,
  inLibrary,
}: {
  igdbId: number
  inLibrary: boolean
}) {
  const id = String(igdbId)
  const { updateGameStatus } = useGameStatus(inLibrary ? id : undefined)
  const { addGame } = useAddGame(id)
  const [isSaving, setIsSaving] = useState(false)

  async function startPlaying() {
    setIsSaving(true)
    try {
      if (inLibrary) {
        await updateGameStatus({ statusIds: STATUS.PLAYING })
      } else {
        await addGame({ statusIds: STATUS.PLAYING })
      }
    } catch {
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="md"
      loading={isSaving}
      onClick={startPlaying}
      className="whitespace-nowrap"
    >
      Começar a jogar
    </Button>
  )
}

function Suggestion({
  game,
  message,
  inLibrary,
  onAnother,
}: {
  game: GameCardData
  message?: string
  inLibrary: boolean
  onAnother?: () => void
}) {
  return (
    <div className="mt-4 flex items-end gap-4 lg:gap-6">
      <Link
        to={`/games/${encodeURIComponent(game.igdbId)}`}
        className={`w-28 flex-none sm:w-36 lg:w-44 ${coverLink}`}
      >
        <GameCard game={game} size="medium" interactive={false} />
      </Link>
      <div className="min-w-0">
        <p className="text-lg font-semibold leading-snug text-white lg:text-xl">
          {game.name}
        </p>
        {message && <p className="mt-1 text-sm text-gray-400">{message}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <StartPlayingButton
            key={game.igdbId}
            igdbId={game.igdbId}
            inLibrary={inLibrary}
          />
          {onAnother ? (
            <button type="button" onClick={onAnother} className={textLink}>
              Outra sugestão
            </button>
          ) : (
            !inLibrary && (
              <Link to="/games" className={textLink}>
                Explorar jogos
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export function NextUp({
  backlog,
  libraryIds,
  suggestion,
  title = 'Para jogar em seguida',
  showEmptyNote = true,
}: {
  backlog: UserGameEntry[]
  libraryIds: Set<number>
  suggestion: GameToDisplayResponse | undefined
  title?: string
  showEmptyNote?: boolean
}) {
  const [offset, setOffset] = useState(0)
  const pinnedId = useRef<number | null>(null)
  const outsideSuggestion = useRef<GameToDisplayResponse | null>(null)

  const suggestedId = suggestion?.game?.igdbId
  if (pinnedId.current === null && suggestion) {
    pinnedId.current = suggestedId ?? -1
  }

  if (
    outsideSuggestion.current?.game &&
    libraryIds.has(outsideSuggestion.current.game.igdbId)
  ) {
    outsideSuggestion.current = null
  }
  if (
    !outsideSuggestion.current &&
    suggestion?.game &&
    !libraryIds.has(suggestion.game.igdbId)
  ) {
    outsideSuggestion.current = suggestion
  }

  if (backlog.length > 0) {
    const start = Math.max(
      0,
      backlog.findIndex(game => game.igdbId === pinnedId.current)
    )
    const at = (step: number) =>
      backlog[(start + offset + step) % backlog.length]
    const current = at(0)
    const queue = Array.from(
      { length: Math.min(QUEUE_SIZE, backlog.length - 1) },
      (_, i) => at(i + 1)
    )

    return (
      <section className="min-w-0">
        <h2 className={sectionTitle}>{title}</h2>
        <Suggestion
          game={current}
          message={
            current.igdbId === suggestedId ? suggestion?.message : undefined
          }
          inLibrary
          onAnother={
            backlog.length > 1 ? () => setOffset(value => value + 1) : undefined
          }
        />
        {queue.length > 0 && (
          <>
            <p className="mb-2 mt-6 text-sm text-gray-400">
              Também na sua fila
            </p>
            <ul className="flex flex-col gap-3 lg:flex-row lg:gap-4">
              {queue.map(game => (
                <li key={game.igdbId} className="min-w-0 lg:flex-1">
                  <Link
                    to={`/games/${encodeURIComponent(game.igdbId)}`}
                    className="group flex w-fit max-w-full items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                  >
                    <span className="flex-none">
                      <GameCard game={game} size="small" interactive={false} />
                    </span>
                    <span className="line-clamp-2 min-w-0 text-sm leading-snug text-gray-200 group-hover:text-white">
                      {game.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    )
  }

  const outside = outsideSuggestion.current

  return (
    <section className="min-w-0">
      <h2 className={sectionTitle}>{title}</h2>
      {outside?.game ? (
        <>
          {showEmptyNote && (
            <p className="mt-4 text-gray-400">Sua fila está vazia.</p>
          )}
          <Suggestion
            game={outside.game}
            message={outside.message}
            inLibrary={false}
          />
        </>
      ) : (
        <div className="mt-4 flex flex-col items-start gap-2">
          <p className="max-w-sm text-gray-400">
            Sua fila está vazia. Marque jogos como Pendente para ver sugestões
            aqui.
          </p>
          <Link to="/games" className={textLink}>
            Explorar jogos
          </Link>
        </div>
      )}
    </section>
  )
}
