import { LegalPage, type LegalSection } from '../components/legalPage'

const sections: LegalSection[] = [
  {
    heading: 'Fale com a gente',
    paragraphs: [
      'Para dúvidas, denúncias de conteúdo ou pedidos sobre seus dados pessoais, escreva para mathsousadev@gmail.com. Respondemos em até 2 dias úteis.',
      'Não envie senhas nem documentos pessoais por e-mail.'
    ]
  }
]

export function ContactPage() {
  return <LegalPage title="Contato" sections={sections} />
}
