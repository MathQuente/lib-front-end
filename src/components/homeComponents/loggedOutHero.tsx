import { Link } from 'react-router-dom'
import { LIBRARY_STATUS_BADGES } from '../gamesComponents/gameCard'
import { CoverWall } from './coverWall'
import { textLink } from './styles'

const LEGEND = [
  { status: 'PLAYED', label: 'Zerado' },
  { status: 'PLAYING', label: 'Jogando' },
  { status: 'BACKLOG', label: 'Pendente' },
  { status: 'WISHLIST', label: 'Desejo' },
]

export function LoggedOutHero({ covers }: { covers: string[] }) {
  return (
    <section className="relative -mx-4 -mt-4 overflow-hidden sm:-mx-6 md:-mt-6 lg:-mx-10 2xl:-mx-16">
      <div className="px-4 pb-8 pt-8 sm:px-6 lg:absolute lg:bottom-10 lg:left-10 lg:z-10 lg:w-[31rem] lg:rounded-lg lg:border lg:border-dark-border lg:bg-dark-bg lg:p-8 2xl:left-16">
        <h1 className="min-w-0 text-balance break-words font-display text-[1.75rem] font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.6rem]">
          Sua biblioteca de jogos, do jeito que você joga.
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-gray-400">
          Guarde cada jogo no status certo, com horas por plataforma, nota e
          review. Dá para trazer sua biblioteca da Steam, da PSN e do Xbox.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            to="/auth?tab=signUp"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-base font-bold text-white transition-colors duration-200 hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light active:scale-[0.98]"
          >
            Criar conta
          </Link>
          <Link to="/games" className={textLink}>
            Explorar jogos
          </Link>
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-300">
          {LEGEND.map(({ status, label }) => (
            <li key={status} className="flex items-center gap-1.5">
              <span
                className={`size-2.5 rounded-full ${LIBRARY_STATUS_BADGES[status].barColor}`}
                aria-hidden="true"
              />
              {label}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:py-5">
        <CoverWall covers={covers} />
      </div>
    </section>
  )
}
