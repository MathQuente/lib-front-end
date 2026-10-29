import { Link } from 'react-router-dom'
import { sectionTitleClass } from '../components/aboutComponents/styles'
import { CopyAddress } from '../components/contactComponents/copyAddress'
import { TopicLink } from '../components/contactComponents/topicLink'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const tips = [
  'Seu nome de usuário no EuZerei.',
  'O endereço da página onde aconteceu.',
  'O que você esperava e o que aconteceu.',
  'Uma captura de tela, se ajudar.',
]

const related = [
  {
    to: '/sobre',
    title: 'Perguntas frequentes',
    hint: 'Gratuidade, perfis e importação.',
  },
  {
    to: '/termos',
    title: 'Termos de uso',
    hint: 'Como analisamos denúncias.',
  },
  {
    to: '/privacidade',
    title: 'Política de privacidade',
    hint: 'Como tratamos seus dados. Para excluir a conta, abra seu perfil.',
  },
]

export function ContactPage() {
  useDocumentTitle('Contato')

  return (
    <div className="pt-2 pb-8 md:pt-4 md:pb-12">
      <article className="grid w-full min-w-0 gap-12 lg:grid-cols-[7fr_5fr] lg:items-start lg:gap-14">
        <div className="flex min-w-0 flex-col gap-10">
          <div className="flex flex-col gap-5">
            <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-none tracking-tight text-white">
              Contato
            </h1>
            <p className="max-w-[60ch] text-lg leading-relaxed text-gray-300">
              Dúvidas, denúncias de conteúdo e pedidos sobre seus dados pessoais
              vão para o mesmo endereço.
            </p>
            <CopyAddress />
            <p className="max-w-[56ch] text-gray-400">
              Respondemos em até 2 dias úteis. Quem mantém o projeto lê as
              mensagens.
            </p>
          </div>

          <section
            aria-labelledby="contact-tips"
            className="flex flex-col gap-4"
          >
            <h2 id="contact-tips" className={sectionTitleClass}>
              Para a resposta sair mais rápido
            </h2>
            <ul className="grid list-none border-t border-dark-border sm:grid-cols-2 sm:gap-x-7">
              {tips.map(tip => (
                <li
                  key={tip}
                  className="border-b border-dark-border px-0.5 py-3.5 text-gray-200"
                >
                  {tip}
                </li>
              ))}
            </ul>
            <p className="rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-gray-200">
              <strong className="font-semibold text-amber-400">
                Importante:
              </strong>{' '}
              não envie senhas nem documentos pessoais por e-mail.
            </p>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-10">
          <section
            aria-labelledby="contact-topics"
            className="flex flex-col gap-4"
          >
            <h2 id="contact-topics" className={sectionTitleClass}>
              Sobre o que você quer falar?
            </h2>
            <div className="flex flex-col gap-2">
              <TopicLink
                title="Dúvida ou problema no site"
                hint="Diga qual página e o que você esperava ver."
                subject="[EuZerei] Dúvida ou problema"
                about="dúvida ou problema no site"
              />
              <TopicLink
                title="Denunciar conteúdo"
                hint="Mande o endereço do perfil, da resenha ou do jogo."
                subject="[EuZerei] Denúncia de conteúdo"
                about="denúncia de conteúdo"
              />
              <TopicLink
                title="Meus dados pessoais"
                hint="Acesso, correção ou exclusão dos seus dados."
                subject="[EuZerei] Pedido sobre dados pessoais"
                about="dados pessoais"
              />
            </div>
          </section>

          <section
            aria-labelledby="contact-related"
            className="flex flex-col gap-4"
          >
            <h2 id="contact-related" className={sectionTitleClass}>
              Antes de escrever
            </h2>
            <ul className="grid list-none gap-2 sm:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3">
              {related.map(({ to, title, hint }) => (
                <li key={to} className="min-w-0">
                  <Link
                    to={to}
                    className="flex h-full min-h-[4.5rem] flex-col justify-center gap-0.5 rounded-lg border border-dark-border px-4 py-3 transition-colors hover:bg-dark-bg-lighter focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                  >
                    <span className="font-semibold text-primary-link">
                      {title}
                    </span>
                    <span className="text-[13px] text-gray-400">{hint}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </div>
  )
}
