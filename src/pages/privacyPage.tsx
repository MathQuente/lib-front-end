import { LegalPage, type LegalSection } from '../components/legalPage'

const sections: LegalSection[] = [
  {
    heading: '1. Quem é o controlador',
    paragraphs: [
      'Controlador: Matheus de Sousa Silva, e-mail euzerei.suporte@gmail.com. Pedidos sobre seus dados podem ser enviados para esse endereço.'
    ]
  },
  {
    heading: '2. Dados que coletamos',
    paragraphs: [
      'Cadastro: e-mail e senha (guardada apenas em forma de hash) ou, se você entrar com Google ou Discord, os dados básicos que esses serviços informam.',
      'Perfil e uso: nome de usuário, foto, banner, biblioteca de jogos, horas jogadas, notas, resenhas e quem você segue.',
      'Integrações opcionais: ao vincular Steam, Xbox ou PlayStation, guardamos o identificador das contas e importamos sua biblioteca, horas e conquistas.',
      'Aceite: data e versão dos Termos que você aceitou ao criar a conta.',
      'Dados técnicos: cookies de sessão e registros de acesso necessários para segurança e limite de tentativas.'
    ]
  },
  {
    heading: '3. Para que usamos',
    paragraphs: [
      'Para criar e manter sua conta, mostrar sua biblioteca e seu perfil, enviar e-mails de verificação e de redefinição de senha e proteger o serviço contra abuso. Tratamos esses dados para executar o serviço que você pediu ao criar a conta e, nas integrações opcionais (Steam, Xbox e PlayStation), com o seu consentimento ao vinculá-las.'
    ]
  },
  {
    heading: '4. Perfis públicos',
    paragraphs: [
      'Seu perfil e sua biblioteca são públicos. Não há opção de torná-los privados nesta versão. Quem visitar seu perfil vê suas notas, resenhas e os status que você marcou.'
    ]
  },
  {
    heading: '5. Com quem compartilhamos',
    paragraphs: [
      'Usamos prestadores para operar o serviço: IGDB/Twitch (dados de jogos), Cloudinary (imagens), SendGrid (e-mails), Google e Discord (login), Steam, OpenXBL e PlayStation (importação) e o provedor de hospedagem. Os servidores e parte desses prestadores podem ficar fora do Brasil, então seus dados podem ser transferidos para outros países.'
    ]
  },
  {
    heading: '6. Retenção e exclusão',
    paragraphs: [
      'Mantemos seus dados enquanto sua conta existir. Ao excluí-la em Editar perfil, os dados da conta são apagados na hora do nosso banco de dados. Fotos e banner enviados ficam no Cloudinary e podem permanecer lá; para removê-los, escreva para euzerei.suporte@gmail.com. Cópias de segurança e registros técnicos de acesso são mantidos pelos provedores de hospedagem por prazo limitado, definido por cada provedor, e apagados automaticamente ao fim desse prazo.'
    ]
  },
  {
    heading: '7. Seus direitos',
    paragraphs: [
      'Conforme o art. 18 da LGPD, você pode pedir acesso, correção, eliminação, portabilidade, informações sobre compartilhamento, e revogar consentimento ou se opor a um tratamento. Escreva para euzerei.suporte@gmail.com; respondemos em até 15 dias.'
    ]
  },
  {
    heading: '8. Cookies',
    paragraphs: [
      'Usamos cookies de sessão para manter você conectado. Não usamos cookies de publicidade nem ferramentas de análise de uso.'
    ]
  },
  {
    heading: '9. Crianças e adolescentes',
    paragraphs: [
      'O EuZerei é só para maiores de 18 anos (veja os Termos de uso).'
    ]
  }
]

export function PrivacyPage() {
  return (
    <LegalPage
      title="Política de privacidade"
      updatedAt="30 de outubro de 2026"
      sections={sections}
    />
  )
}
