import { sectionTitleClass } from './styles'

const facts = [
  ['Gênero', 'Biblioteca pessoal de jogos'],
  ['Plataforma', 'Navegador, no computador e no celular'],
  ['Feito por', 'Matheus de Sousa Silva'],
  ['Dados de jogos', 'IGDB'],
  ['Importa de', 'Steam, Xbox e PlayStation'],
  ['Preço', 'Gratuito'],
  ['Estado', 'Em desenvolvimento contínuo'],
]

export function GameSheet() {
  return (
    <section
      aria-labelledby="about-sheet"
      className="flex flex-col gap-5 border-t border-dark-border pt-7"
    >
      <div className="flex items-center gap-3.5">
        <svg
          viewBox="0 0 256 256"
          aria-hidden="true"
          className="size-9 shrink-0 text-primary"
        >
          <g transform="translate(-17.66 -17.66) scale(1.138)">
            <path
              fill="currentColor"
              d="M20 40L236 40L236 80L140 176L236 176L236 216L20 216Z M60 176L84 176L180 80L60 80Z M60 112L108 112L108 144L60 144Z"
            />
          </g>
        </svg>
        <h2 id="about-sheet" className={sectionTitleClass}>
          Ficha do jogo
        </h2>
      </div>
      <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map(([term, value]) => (
          <div
            key={term}
            className={term === 'Estado' ? 'min-w-0 sm:col-span-2' : 'min-w-0'}
          >
            <dt className="text-xs text-gray-400">{term}</dt>
            <dd className="text-gray-200">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="max-w-[60ch] text-xs text-gray-400">
        O EuZerei não é afiliado à IGDB, à Twitch nem aos titulares dos jogos.
      </p>
    </section>
  )
}
