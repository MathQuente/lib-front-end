export type NotFoundGroupKey = 'unnamed' | 'beta' | 'tool' | 'other'

export interface NotFoundItem {
  name: string
  appId?: number
}

export interface NotFoundGroup {
  key: NotFoundGroupKey
  label: string
  items: NotFoundItem[]
}

const UNNAMED_APP = /^App (\d+)$/
const BETA =
  /\b(beta|alpha|playtest|public test|test server|testing|demo|ptr|closed test|open test)\b/i
const TOOL =
  /\b(wallpaper engine|soundpad|sdk|dedicated server|editor|benchmark|toolkit|tools?)\b/i

const LABELS: Record<NotFoundGroupKey, string> = {
  unnamed: 'Sem nome na Steam',
  beta: 'Betas, testes e demos',
  tool: 'Programas e ferramentas',
  other: 'Outros',
}

const ORDER: NotFoundGroupKey[] = ['unnamed', 'beta', 'tool', 'other']

function classify(name: string): { key: NotFoundGroupKey; appId?: number } {
  const unnamed = UNNAMED_APP.exec(name)
  if (unnamed) return { key: 'unnamed', appId: Number(unnamed[1]) }
  if (BETA.test(name)) return { key: 'beta' }
  if (TOOL.test(name)) return { key: 'tool' }
  return { key: 'other' }
}

export function groupNotFound(names: string[]): NotFoundGroup[] {
  const buckets = new Map<NotFoundGroupKey, NotFoundItem[]>()

  for (const name of names) {
    const { key, appId } = classify(name)
    const items = buckets.get(key) ?? []
    items.push({ name, appId })
    buckets.set(key, items)
  }

  return ORDER.filter(key => buckets.has(key)).map(key => ({
    key,
    label: LABELS[key],
    items: buckets.get(key) ?? [],
  }))
}
