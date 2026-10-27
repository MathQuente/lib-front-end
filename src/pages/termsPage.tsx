import { LegalPage, type LegalSection } from '../components/legalPage'

const sections: LegalSection[] = [
  {
    heading: '1. Quem somos',
    paragraphs: [
      'O EuZerei é um projeto pessoal e gratuito, feito como portfólio, para registrar e avaliar jogos. Responsável: Matheus de Sousa Silva. Contato: mathsousadev@gmail.com.',
      'Ao criar uma conta, você declara que leu e aceita estes Termos e a Política de Privacidade.'
    ]
  },
  {
    heading: '2. Quem pode usar',
    paragraphs: [
      'É preciso ter 18 anos ou mais. Ao criar a conta, você declara que tem essa idade, e registramos a data e a versão dos Termos que você aceitou.',
      'Se identificarmos uma conta de menor de 18 anos, ela será encerrada e os dados pessoais, eliminados.'
    ]
  },
  {
    heading: '3. O que você publica',
    paragraphs: [
      'Resenhas, notas, nome de usuário e imagens ficam visíveis em perfis públicos. Você continua sendo o titular do que publica e autoriza o EuZerei a exibir, armazenar e processar esse conteúdo apenas para operar o serviço.',
      'Conteúdo que viole estes Termos pode ser denunciado em mathsousadev@gmail.com. A denúncia será analisada em até 2 dias úteis e o conteúdo poderá ser removido ou a conta suspensa.'
    ]
  },
  {
    heading: '4. Encerrar a conta',
    paragraphs: [
      'Você pode excluir sua conta em Editar perfil. A exclusão é imediata e definitiva. Cópias de segurança do banco de dados e registros técnicos de acesso são mantidos pelos provedores de hospedagem por prazo limitado, definido por cada provedor, e apagados automaticamente ao fim desse prazo.',
      'O EuZerei pode suspender ou encerrar contas que violem estes Termos.'
    ]
  },
  {
    heading: '5. Dados de jogos',
    paragraphs: [
      'Capas e dados de jogos são fornecidos pela IGDB.',
      'O EuZerei não é afiliado à IGDB, à Twitch nem aos titulares dos jogos.'
    ]
  },
  {
    heading: '6. Responsabilidade e lei aplicável',
    paragraphs: [
      'O serviço é fornecido como está, sem garantia de disponibilidade, por ser um projeto pessoal. Estas regras seguem a legislação brasileira.'
    ]
  }
]

export function TermsPage() {
  return (
    <LegalPage
      title="Termos de uso"
      updatedAt="25 de outubro de 2026"
      sections={sections}
    />
  )
}
