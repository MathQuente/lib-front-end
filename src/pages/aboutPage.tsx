import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Faq } from '../components/aboutComponents/faq'
import { FeatureShowcase } from '../components/aboutComponents/featureShowcase'
import { GameSheet } from '../components/aboutComponents/gameSheet'
import {
  primaryButtonClass,
  secondaryButtonClass,
  sectionTitleClass,
} from '../components/aboutComponents/styles'
import { TypedGameName } from '../components/aboutComponents/typedGameName'
import { ImportGamesModal } from '../components/libraryComponents/importGamesModal'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePlatformLinkResult } from '../hooks/usePlatformLinkResult'

const steps = [
  { title: 'Crie a conta', text: 'Com e-mail, Google ou Discord.' },
  {
    title: 'Traga ou procure seus jogos',
    text: 'Importe da Steam, Xbox ou PlayStation, ou busque jogo por jogo.',
  },
  {
    title: 'Marque o estado de cada um',
    text: 'E volte quando zerar o próximo.',
  },
]

export function AboutPage() {
  useDocumentTitle('Sobre')
  usePlatformLinkResult()
  const { user, loading } = useAuth()
  const [importOpen, setImportOpen] = useState(false)

  return (
    <div className="flex justify-center pt-2 pb-8 md:pt-4 md:pb-12">
      <article className="flex w-full min-w-0 flex-col gap-12 lg:gap-[4.5rem]">
        <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-14">
          <header className="flex min-w-0 flex-col gap-5">
            <h1 className="sr-only">Sobre o EuZerei</h1>
            <TypedGameName />
            <p className="max-w-[38ch] text-lg leading-snug text-gray-200 md:text-xl">
              O EuZerei é a sua biblioteca de jogos, do que você zerou ao que
              ainda vai jogar.
            </p>
            <p className="max-w-[60ch] text-[15px] leading-relaxed text-gray-300">
              Você marca cada jogo como{' '}
              <strong className="font-semibold text-white">
                jogado, jogando, pausado, na fila, na lista de desejos ou
                largado
              </strong>
              , dá nota, escreve resenhas e segue outras pessoas. Também dá para
              importar a biblioteca da Steam, do Xbox e da PlayStation.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {loading ? null : user?.id ? (
                <>
                  <button
                    type="button"
                    className={primaryButtonClass}
                    onClick={() => setImportOpen(true)}
                  >
                    Importar jogos
                  </button>
                  <Link to="/userLibrary" className={secondaryButtonClass}>
                    Minha biblioteca
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth?tab=signUp" className={primaryButtonClass}>
                    Criar conta
                  </Link>
                  <Link to="/games" className={secondaryButtonClass}>
                    Ver jogos
                  </Link>
                </>
              )}
            </div>
          </header>
          <section
            aria-labelledby="about-name"
            className="min-w-0 border-t border-dark-border pt-5"
          >
            <h2
              id="about-name"
              className="font-display text-[15px] font-extrabold text-primary-light"
            >
              Por que esse nome?
            </h2>
            <p className="mt-2.5 max-w-[44ch] text-lg leading-relaxed text-gray-200">
              Zerar é chegar nos créditos. Fiz o EuZerei pra ter onde anotar
              cada jogo que eu zerei, e cada um que ainda está na fila esperando
              a vez.
            </p>
          </section>
        </div>
        <FeatureShowcase />

        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-14">
          <section
            aria-labelledby="about-start"
            className="flex flex-col gap-5"
          >
            <h2 id="about-start" className={sectionTitleClass}>
              Como começar
            </h2>
            <ol className="flex list-none flex-col gap-5">
              {steps.map(({ title, text }, index) => (
                <li
                  key={title}
                  className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3"
                >
                  <span
                    aria-hidden="true"
                    className="row-span-2 font-display text-2xl font-extrabold leading-none text-primary-light"
                  >
                    {index + 1}
                  </span>
                  <h3 className="text-[15px] font-semibold text-white">
                    {title}
                  </h3>
                  <p className="text-gray-400">{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <Faq />
        </div>
        <GameSheet />
      </article>

      {user?.id && (
        <ImportGamesModal open={importOpen} onOpenChange={setImportOpen} />
      )}
    </div>
  )
}
