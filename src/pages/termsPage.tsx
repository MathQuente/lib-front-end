import { LegalPage, type LegalSection } from '../components/legalPage'

const sections: LegalSection[] = [
  {
    heading: '1. Quem somos',
    paragraphs: [
      'O EuZerei é um projeto pessoal e gratuito, feito como portfólio, para registrar e avaliar jogos. Contato: euzerei.suporte@gmail.com.',
      'Ao criar uma conta, você declara que leu e aceita estes Termos e a Política de Privacidade.',
    ],
  },
  {
    heading: '2. O que você publica',
    paragraphs: [
      'Resenhas, notas, nome de usuário e imagens ficam visíveis em perfis públicos. Você continua sendo o titular do que publica e autoriza o EuZerei a exibir, armazenar e processar esse conteúdo apenas para operar o serviço.',
      'Conteúdo que viole estes Termos pode ser denunciado em euzerei.suporte@gmail.com. A denúncia será analisada em até 15 dias e o conteúdo poderá ser removido ou a conta suspensa.',
    ],
  },
  {
    heading: '3. Encerrar a conta',
    paragraphs: [
      'Você pode excluir sua conta em Editar perfil. A exclusão dos dados da conta é imediata e definitiva. Detalhes sobre cópias de segurança estão na Política de Privacidade.',
      'O EuZerei pode suspender ou encerrar contas que violem estes Termos.',
    ],
  },
  {
    heading: '4. Dados de jogos',
    paragraphs: [
      'Capas e dados de jogos são fornecidos pela IGDB.',
      'O EuZerei não é afiliado à IGDB, à Twitch nem aos titulares dos jogos.',
    ],
  },
  {
    heading: '5. Responsabilidade e lei aplicável',
    paragraphs: [
      'O serviço é fornecido como está, sem garantia de disponibilidade, por ser um projeto pessoal. Estas regras seguem a legislação brasileira.',
    ],
  },
]

export function TermsPage() {
  return (
    <LegalPage
      title="Termos de uso"
      updatedAt="11 de novembro de 2026"
      sections={sections}
    />
  )
}
