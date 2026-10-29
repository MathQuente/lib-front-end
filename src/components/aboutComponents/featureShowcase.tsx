import type { ReactNode } from 'react'
import { TotalsStrip } from '../totalsGrid'
import { sectionTitleClass } from './styles'

const STATES = ['Jogado', 'Jogando', 'Pausado', 'Na fila', 'Desejos', 'Larguei']
const SELECTED_STATE = 'Jogando'

const chipClass =
  'rounded-full border border-dark-border bg-dark-bg px-2.5 py-1 text-[13px] text-gray-300'

function Sample({ children }: { children: ReactNode }) {
  return (
    <div className="mt-1 flex min-w-0 flex-col gap-2 rounded-lg bg-dark-bg-lighter px-3.5 py-3">
      <span className="text-[11px] text-gray-400">exemplo</span>
      {children}
    </div>
  )
}

function Feature({
  title,
  text,
  children,
}: {
  title: string
  text: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:gap-y-2.5">
      <h3 className="text-[15px] font-semibold text-white">{title}</h3>
      <p className="max-w-[46ch] text-gray-400">{text}</p>
      {children}
    </div>
  )
}

export function FeatureShowcase() {
  return (
    <section aria-labelledby="about-features" className="flex flex-col gap-5">
      <h2 id="about-features" className={sectionTitleClass}>
        O que dá para fazer
      </h2>

      <div className="grid gap-7 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-11 2xl:grid-cols-4 2xl:gap-x-7">
        <Feature
          title="Cada jogo no lugar certo"
          text="Seis estados, do que você já zerou ao que só quer ter de olho. Mudar de um para outro é rápido."
        >
          <Sample>
            <p className="sr-only">
              {`Seis estados: ${STATES.join(', ')}. ${SELECTED_STATE} está marcado.`}
            </p>
            <div aria-hidden="true" className="flex flex-wrap gap-1.5">
              {STATES.map(state => (
                <span
                  key={state}
                  className={
                    state === SELECTED_STATE
                      ? 'rounded-full border border-primary bg-primary/10 px-2.5 py-1 text-[13px] text-primary-link'
                      : chipClass
                  }
                >
                  {state}
                </span>
              ))}
            </div>
          </Sample>
        </Feature>

        <Feature
          title="Nota e resenha"
          text="Dê uma nota de 0,5 a 5 estrelas, escreva o que achou e veja a nota da comunidade. As resenhas aparecem no seu perfil público."
        >
          <Sample>
            <p className="sr-only">4 de 5 estrelas</p>
            <p
              aria-hidden="true"
              className="text-lg tracking-wider text-primary-light"
            >
              ★★★★<span className="text-gray-500">★</span>
            </p>
            <p className="text-sm text-gray-300">
              “Mundo lindo, mas a segunda metade repete demais.”
            </p>
          </Sample>
        </Feature>

        <Feature
          title="Traga o que você já jogou"
          text="Conecte a Steam, o Xbox ou a PlayStation e importe a biblioteca de uma vez. Os jogos que já estão no EuZerei continuam lá."
        >
          <Sample>
            <div className="flex flex-wrap gap-1.5">
              {['Steam', 'Xbox', 'PlayStation'].map(platform => (
                <span key={platform} className={chipClass}>
                  {platform}
                </span>
              ))}
            </div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-300">
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-green-400"
                />
                Xbox conectado
              </span>
              <span>Importar do Xbox</span>
            </p>
          </Sample>
        </Feature>

        <Feature
          title="Horas e zeradas"
          text="Registre quantas horas jogou em cada plataforma, quantas vezes zerou e quando terminou."
        >
          <Sample>
            <TotalsStrip
              hours={32.9}
              completions={1}
              completedAt="2016-12-04"
            />
          </Sample>
        </Feature>
      </div>
    </section>
  )
}
