import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserGameEntry } from '../../types/games'
import { getLibraryPlatform } from '../../utils/libraryPlatforms'
import { GameCard, LIBRARY_STATUS_BADGES } from '../gamesComponents/gameCard'
import { GameInfo } from '../gamesComponents/gameInfo'
import { GameModal } from '../gamesComponents/gameModal'
import { coverLink, sectionTitle, textLink } from './styles'

const MAX_PLAYING = 3

const PLATFORM_PREPOSITION: Record<string, string> = {
  STEAM: 'na',
  EPIC: 'na',
  PLAYSTATION: 'no',
  XBOX: 'no',
  NINTENDO: 'no',
}

function playedSummary(game: UserGameEntry) {
  const hours = Math.round(game.hoursPlayed ?? 0)
  const platforms = (game.playedOn ?? []).flatMap(value => {
    const option = getLibraryPlatform(value)
    const preposition = PLATFORM_PREPOSITION[value]
    return option && preposition ? [`${preposition} ${option.label}`] : []
  })
  const where =
    platforms.length > 1
      ? `${platforms.slice(0, -1).join(', ')} e ${platforms[platforms.length - 1]}`
      : platforms.join('')

  if (hours > 0) return where ? `${hours} h ${where}` : `${hours} h`
  return where ? where.charAt(0).toUpperCase() + where.slice(1) : null
}

function ChangeStatus({ game }: { game: UserGameEntry }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`text-xs lg:text-sm ${textLink}`}
      >
        Mudar status
      </button>
      {open && (
        <GameModal open={open} onOpenChange={setOpen}>
          <GameInfo game={game} onClose={() => setOpen(false)} />
        </GameModal>
      )}
    </>
  )
}

function PlayingStatus({ game }: { game: UserGameEntry }) {
  return (
    <div className="mt-2 flex items-center gap-3 text-sm text-gray-400">
      <span className="hidden items-center gap-1.5 lg:inline-flex">
        <span
          className={`size-2.5 rounded-full ${LIBRARY_STATUS_BADGES.PLAYING.barColor}`}
          aria-hidden="true"
        />
        Jogando
      </span>
      <ChangeStatus game={game} />
    </div>
  )
}

export function PlayingNow({
  games,
  total,
}: {
  games: UserGameEntry[]
  total: number
}) {
  const shown = games.slice(0, MAX_PLAYING)

  return (
    <section className="min-w-0">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className={sectionTitle}>Jogando agora</h2>
        {total > MAX_PLAYING && (
          <Link
            to="/userLibrary/playingGames"
            className={`text-sm ${textLink}`}
          >
            Ver todos os {total}
          </Link>
        )}
      </div>

      {shown.length === 0 && (
        <div className="mt-4 flex flex-col items-start gap-2">
          <p className="text-gray-400">Você não está jogando nada agora.</p>
          <Link to="/games" className={textLink}>
            Explorar jogos
          </Link>
        </div>
      )}

      {shown.length === 1 && (
        <div className="mt-4 flex items-end gap-4 lg:gap-6">
          <Link
            to={`/games/${encodeURIComponent(shown[0].igdbId)}`}
            className={`w-28 flex-none sm:w-36 lg:w-44 ${coverLink}`}
          >
            <GameCard game={shown[0]} size="medium" interactive={false} />
          </Link>
          <div className="min-w-0">
            <p className="text-lg font-semibold leading-snug text-white lg:text-xl">
              {shown[0].name}
            </p>
            {playedSummary(shown[0]) && (
              <p className="mt-1 text-sm text-gray-400">
                {playedSummary(shown[0])}
              </p>
            )}
            <PlayingStatus game={shown[0]} />
          </div>
        </div>
      )}

      {shown.length > 1 && (
        <ul className="mt-4 grid grid-cols-3 gap-3 lg:flex lg:gap-6">
          {shown.map(game => (
            <li key={game.igdbId} className="min-w-0 lg:w-40 xl:w-44">
              <Link
                to={`/games/${encodeURIComponent(game.igdbId)}`}
                className={coverLink}
              >
                <GameCard game={game} size="medium" interactive={false} />
              </Link>
              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-white lg:text-base">
                {game.name}
              </p>
              {playedSummary(game) && (
                <p className="text-xs text-gray-400 lg:text-sm">
                  {playedSummary(game)}
                </p>
              )}
              <PlayingStatus game={game} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
