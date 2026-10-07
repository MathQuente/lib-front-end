import { Link } from 'react-router-dom'
import { Button } from '../button'
import { LIBRARY_STATUS_BADGES } from '../gamesComponents/gameCard'
import { sectionTitle } from '../homeComponents/styles'

const SHELVES = [
  { status: 'PLAYING', label: 'Jogando' },
  { status: 'PLAYED', label: 'Zerados' },
  { status: 'BACKLOG', label: 'Pendentes' },
  { status: 'WISHLIST', label: 'Lista de desejos' },
]

const way =
  'flex flex-col items-start gap-2 rounded-lg border border-dark-border p-5'

export function EmptyLibrary({ onImport }: { onImport: () => void }) {
  return (
    <section className="mt-8 flex flex-col gap-6">
      <div>
        <h2 className={sectionTitle}>Comece a sua biblioteca</h2>
        <p className="mt-1 text-sm text-gray-400">
          Ela está vazia por enquanto. Há dois jeitos de colocar jogos aqui.
        </p>
      </div>

      <div className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
        <div className={way}>
          <h3 className="font-semibold text-white">Trazer o que você já tem</h3>
          <p className="text-sm text-gray-400">
            Conecte a Steam, a PSN ou o Xbox e seus jogos entram de uma vez, com
            as horas jogadas.
          </p>
          <Button
            type="button"
            variant="primary"
            className="mt-2"
            onClick={onImport}
          >
            Importar jogos
          </Button>
        </div>

        <div className={way}>
          <h3 className="font-semibold text-white">Adicionar um por um</h3>
          <p className="text-sm text-gray-400">
            Procure um jogo e marque se está jogando, se já zerou ou se ainda
            quer jogar.
          </p>
          <Link
            to="/games"
            className="mt-2 inline-flex items-center justify-center rounded border border-dark-border px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-dark-bg-lighter focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light active:scale-[0.98]"
          >
            Explorar jogos
          </Link>
        </div>
      </div>

      <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400">
        <span>Depois eles aparecem aqui separados em</span>
        {SHELVES.map(({ status, label }) => {
          const { icon: Icon, iconColor } = LIBRARY_STATUS_BADGES[status]
          return (
            <span key={status} className="inline-flex items-center gap-1.5">
              <Icon
                className={`size-4 shrink-0 ${iconColor}`}
                aria-hidden="true"
              />
              {label}
            </span>
          )
        })}
      </p>
    </section>
  )
}
