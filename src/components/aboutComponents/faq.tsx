import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { sectionTitleClass, textLinkClass } from './styles'

const items: { question: string; answer: ReactNode }[] = [
  {
    question: 'O EuZerei é gratuito?',
    answer:
      'Sim. É um projeto pessoal e gratuito, feito como portfólio e em desenvolvimento contínuo.',
  },
  {
    question: 'O que as outras pessoas veem de mim?',
    answer: (
      <>
        Resenhas, notas, nome de usuário e imagens ficam visíveis em perfis
        públicos. Os detalhes estão nos{' '}
        <Link to="/termos" className={textLinkClass}>
          Termos de uso
        </Link>{' '}
        e na{' '}
        <Link to="/privacidade" className={textLinkClass}>
          Política de privacidade
        </Link>
        .
      </>
    ),
  },
  {
    question: 'Preciso deixar meu perfil público para importar?',
    answer:
      'No Xbox, o perfil e o histórico de jogos precisam estar públicos. Na PlayStation, o histórico de jogos e os troféus precisam estar visíveis para todos. É assim que a importação enxerga sua biblioteca.',
  },
  {
    question: 'Posso apagar minha conta?',
    answer: (
      <>
        Pode, sozinho, no seu perfil. Para dúvidas sobre seus dados, escreva
        pelo{' '}
        <Link to="/contato" className={textLinkClass}>
          Contato
        </Link>
        .
      </>
    ),
  },
]

export function Faq() {
  return (
    <section aria-labelledby="about-faq" className="flex flex-col gap-3">
      <h2 id="about-faq" className={sectionTitleClass}>
        Perguntas frequentes
      </h2>
      <div className="border-t border-dark-border">
        {items.map(({ question, answer }) => (
          <details key={question} className="group border-b border-dark-border">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 rounded-sm px-0.5 py-2.5 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light [&::-webkit-details-marker]:hidden">
              {question}
              <span
                aria-hidden="true"
                className="shrink-0 font-display text-lg font-extrabold text-primary-light"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="max-w-[62ch] px-0.5 pb-3.5 text-gray-300">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
