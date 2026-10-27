import { LegalPage, type LegalSection } from '../components/legalPage'

const sections: LegalSection[] = [
  {
    heading: 'O que é o EuZerei',
    paragraphs: [
      'Uma biblioteca pessoal de jogos: você marca cada um como jogado, jogando, pausado, na fila, na lista de desejos ou largado, dá nota, escreve resenhas e segue outras pessoas. Também dá para importar a biblioteca da Steam, do Xbox e da PlayStation.'
    ]
  },
  {
    heading: 'Quem mantém',
    paragraphs: [
      'Um projeto pessoal e gratuito, feito como portfólio e em desenvolvimento contínuo. Responsável: Matheus de Sousa Silva.'
    ]
  },
  {
    heading: 'Dados de jogos',
    paragraphs: ['Capas e dados de jogos fornecidos pela IGDB.']
  }
]

export function AboutPage() {
  return <LegalPage title="Sobre" sections={sections} />
}
