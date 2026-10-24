const RULES: Array<[test: (n: string) => boolean, label: string]> = [
  [n => n.includes('windows'), 'PC'],
  [n => n.includes('mac'), 'Mac'],
  [n => n.includes('linux'), 'Linux'],
  [n => n.includes('playstation 5'), 'PS5'],
  [n => n.includes('playstation 4'), 'PS4'],
  [n => n.includes('playstation 3'), 'PS3'],
  [n => n.includes('vita'), 'Vita'],
  [n => n.includes('xbox series'), 'Xbox Series'],
  [n => n.includes('xbox one'), 'Xbox One'],
  [n => n.includes('xbox 360'), 'Xbox 360'],
  [n => n.includes('switch 2'), 'Switch 2'],
  [n => n.includes('switch'), 'Switch'],
]

const PRIORITY = [
  'PC',
  'PS5',
  'PS4',
  'Xbox Series',
  'Xbox One',
  'Switch 2',
  'Switch',
]

function shortLabel(name: string) {
  const n = name.toLowerCase()
  return RULES.find(([test]) => test(n))?.[1] ?? name
}

function priorityOf(label: string) {
  const i = PRIORITY.indexOf(label)
  return i === -1 ? PRIORITY.length : i
}

export function shortPlatforms(names: string[] | undefined, max = 3) {
  const labels = [...new Set((names ?? []).map(shortLabel))].sort(
    (a, b) => priorityOf(a) - priorityOf(b)
  )
  return {
    visible: labels.slice(0, max),
    hidden: Math.max(labels.length - max, 0),
  }
}
