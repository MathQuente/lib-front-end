const ROTATION_SECONDS = 6

const QUEUED_MESSAGES = [
  'Entrando na fila da importação...',
  'Soprando o cartucho antes de começar...',
  'Reticulando splines...',
]

const PROGRESS_BANDS: { from: number; messages: string[] }[] = [
  {
    from: 0,
    messages: [
      'Abrindo sua biblioteca...',
      'Fingindo que não vimos o tamanho do backlog...',
    ],
  },
  {
    from: 10,
    messages: [
      'Contando os jogos comprados em promoção e nunca abertos...',
      'Achamos um jogo de 2014 com 12 minutos jogados.',
    ],
  },
  {
    from: 25,
    messages: [
      'Encontramos aquele RPG de 150 horas que você largou no chefe final.',
      'Anotando os jogos que ficaram "só mais uma missão" pra sempre...',
    ],
  },
  {
    from: 40,
    messages: [
      'Separando o que você zerou do que jura que ainda vai zerar...',
      'Conferindo quais créditos finais você realmente viu...',
    ],
  },
  {
    from: 55,
    messages: [
      'Somando as horas jogadas. Fica entre a gente.',
      'Convertendo horas jogadas em "dava pra ter aprendido um idioma"...',
    ],
  },
  {
    from: 70,
    messages: [
      'Conferindo conquistas. A platina ficou pra depois, né?',
      'Procurando o troféu que faltou por causa de um colecionável...',
    ],
  },
  {
    from: 85,
    messages: [
      'Tirando a poeira dos jogos que só rodaram o tutorial...',
      'Arrumando tudo na estante...',
    ],
  },
  {
    from: 95,
    messages: ['Quase lá. Salvando o progresso, não desligue o console.'],
  },
]

function pick(messages: string[], elapsedSeconds: number) {
  return messages[
    Math.floor(elapsedSeconds / ROTATION_SECONDS) % messages.length
  ]
}

export function getImportMessage(
  progress: number | undefined,
  elapsedSeconds: number
): string {
  if (progress === undefined) return pick(QUEUED_MESSAGES, elapsedSeconds)

  const band =
    [...PROGRESS_BANDS].reverse().find(b => progress >= b.from) ??
    PROGRESS_BANDS[0]
  return pick(band.messages, elapsedSeconds)
}

const SLOW_AFTER_SECONDS = 20
const VERY_SLOW_AFTER_SECONDS = 90

export function getSlowImportNotice(elapsedSeconds: number): string | null {
  if (elapsedSeconds >= VERY_SLOW_AFTER_SECONDS) {
    return 'Biblioteca grande, hein? Ainda estamos trabalhando. Pode fechar esta janela e continuar navegando, a importação segue em segundo plano.'
  }
  if (elapsedSeconds >= SLOW_AFTER_SECONDS) {
    return 'Bibliotecas grandes podem levar alguns minutos. Pode continuar navegando enquanto isso.'
  }
  return null
}
