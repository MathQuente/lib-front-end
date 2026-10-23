import type { LibraryPlatform, PlatformConsole } from '../types/platform'
import type { UserGamePlatformEntry } from '../types/platform'

// Espelha CONSOLES_BY_PLATFORM do back end (lib/src/utils/platform-consoles.ts).
// O back valida de novo, então um valor fora do mapa só gera 400.
const PLAYSTATION: PlatformConsole[] = [
  'PS1',
  'PS2',
  'PS3',
  'PS4',
  'PS5',
  'PSP',
  'PS_VITA',
]
// O back também aceita PC em XBOX (Game Pass no PC); a interface não oferece:
// jogo de PC se registra em Steam, Epic ou Outro > PC.
const XBOX: PlatformConsole[] = [
  'XBOX_ORIGINAL',
  'XBOX_360',
  'XBOX_ONE',
  'XBOX_SERIES',
]
const NINTENDO: PlatformConsole[] = [
  'NES',
  'SNES',
  'N64',
  'GAMECUBE',
  'WII',
  'WII_U',
  'SWITCH',
  'SWITCH_2',
  'GAME_BOY',
  'GAME_BOY_COLOR',
  'GAME_BOY_ADVANCE',
  'DS',
  'N3DS',
]

export const CONSOLE_LABELS: Record<PlatformConsole, string> = {
  UNKNOWN: 'Console não informado',
  PC: 'PC',
  STEAM_DECK: 'Steam Deck',
  PS1: 'PS1',
  PS2: 'PS2',
  PS3: 'PS3',
  PS4: 'PS4',
  PS5: 'PS5',
  PSP: 'PSP',
  PS_VITA: 'PS Vita',
  XBOX_ORIGINAL: 'Xbox Original',
  XBOX_360: 'Xbox 360',
  XBOX_ONE: 'Xbox One',
  XBOX_SERIES: 'Xbox Series X|S',
  NES: 'NES',
  SNES: 'SNES',
  N64: 'Nintendo 64',
  GAMECUBE: 'GameCube',
  WII: 'Wii',
  WII_U: 'Wii U',
  SWITCH: 'Switch',
  SWITCH_2: 'Switch 2',
  GAME_BOY: 'Game Boy',
  GAME_BOY_COLOR: 'Game Boy Color',
  GAME_BOY_ADVANCE: 'Game Boy Advance',
  DS: 'Nintendo DS',
  N3DS: 'Nintendo 3DS',
  MASTER_SYSTEM: 'Master System',
  MEGA_DRIVE: 'Mega Drive',
  SEGA_CD: 'Sega CD',
  SATURN: 'Saturn',
  DREAMCAST: 'Dreamcast',
  GAME_GEAR: 'Game Gear',
  ATARI_2600: 'Atari 2600',
  ATARI_7800: 'Atari 7800',
  NEO_GEO: 'Neo Geo',
  TURBOGRAFX: 'TurboGrafx',
  MOBILE: 'Mobile',
  ARCADE: 'Arcade',
}

export interface ConsoleGroup {
  label: string
  consoles: PlatformConsole[]
}

const CONSOLES_BY_PLATFORM: Partial<Record<LibraryPlatform, ConsoleGroup[]>> = {
  STEAM: [{ label: 'Steam', consoles: ['PC', 'STEAM_DECK'] }],
  PLAYSTATION: [{ label: 'PlayStation', consoles: PLAYSTATION }],
  XBOX: [{ label: 'Xbox', consoles: XBOX }],
  NINTENDO: [{ label: 'Nintendo', consoles: NINTENDO }],
}

// Epic só tem PC: não há o que escolher e entra como UNKNOWN (o back aceita
// em qualquer ecossistema). Steam pergunta entre PC e Steam Deck.
export function platformAsksConsole(platform: LibraryPlatform) {
  return platform in CONSOLES_BY_PLATFORM
}

const CONSOLE_BY_IGDB_NAME: Record<string, PlatformConsole> = {
  playstation: 'PS1',
  'playstation 2': 'PS2',
  'playstation 3': 'PS3',
  'playstation 4': 'PS4',
  'playstation 5': 'PS5',
  'playstation portable': 'PSP',
  'playstation vita': 'PS_VITA',
  xbox: 'XBOX_ORIGINAL',
  'xbox 360': 'XBOX_360',
  'xbox one': 'XBOX_ONE',
  'xbox series x|s': 'XBOX_SERIES',
  'nintendo entertainment system': 'NES',
  'super nintendo entertainment system': 'SNES',
  'nintendo 64': 'N64',
  'nintendo gamecube': 'GAMECUBE',
  wii: 'WII',
  'wii u': 'WII_U',
  'nintendo switch': 'SWITCH',
  'nintendo switch 2': 'SWITCH_2',
  'game boy': 'GAME_BOY',
  'game boy color': 'GAME_BOY_COLOR',
  'game boy advance': 'GAME_BOY_ADVANCE',
  'nintendo ds': 'DS',
  'nintendo dsi': 'DS',
  'nintendo 3ds': 'N3DS',
  'new nintendo 3ds': 'N3DS',
  'pc (microsoft windows)': 'PC',
  mac: 'PC',
  linux: 'PC',
  'sega master system/mark iii': 'MASTER_SYSTEM',
  'sega mega drive/genesis': 'MEGA_DRIVE',
  'sega cd': 'SEGA_CD',
  'sega saturn': 'SATURN',
  dreamcast: 'DREAMCAST',
  'sega game gear': 'GAME_GEAR',
  'atari 2600': 'ATARI_2600',
  'atari 7800': 'ATARI_7800',
  android: 'MOBILE',
  ios: 'MOBILE',
  arcade: 'ARCADE',
}

const PLAYABLE_ON_SUCCESSOR: Partial<Record<PlatformConsole, PlatformConsole>> =
  {
    PS4: 'PS5',
    XBOX_ONE: 'XBOX_SERIES',
    SWITCH: 'SWITCH_2',
    PC: 'STEAM_DECK',
  }

function consoleFromIgdbName(name: string): PlatformConsole | undefined {
  const normalized = name.trim().toLowerCase()
  if (normalized in CONSOLE_BY_IGDB_NAME)
    return CONSOLE_BY_IGDB_NAME[normalized]
  if (normalized.startsWith('neo geo')) return 'NEO_GEO'
  if (normalized.startsWith('turbografx') || normalized.includes('pc engine')) {
    return 'TURBOGRAFX'
  }
  return undefined
}

// Consoles em que o jogo saiu (mais os sucessores retrocompatíveis).
// `null` = sem dado de plataformas: não filtra.
export function consolesForGame(
  gamePlatforms: string[] | undefined
): Set<PlatformConsole> | null {
  if (!gamePlatforms || gamePlatforms.length === 0) return null
  const found = new Set<PlatformConsole>()
  for (const name of gamePlatforms) {
    const value = consoleFromIgdbName(name)
    if (!value) continue
    found.add(value)
    const successor = PLAYABLE_ON_SUCCESSOR[value]
    if (successor) found.add(successor)
  }
  return found.size > 0 ? found : null
}

// Sem nenhum console do ecossistema depois do filtro (dado da IGDB incompleto),
// volta à lista inteira para o usuário não ficar sem opção.
export function consoleGroupsFor(
  platform: LibraryPlatform,
  released: Set<PlatformConsole> | null = null
): ConsoleGroup[] {
  const groups = CONSOLES_BY_PLATFORM[platform] ?? []
  if (!released) return groups
  const filtered = groups
    .map(group => ({
      ...group,
      consoles: group.consoles.filter(c => released.has(c)),
    }))
    .filter(group => group.consoles.length > 0)
  return filtered.length > 0 ? filtered : groups
}

export function consoleLabel(value: PlatformConsole) {
  return CONSOLE_LABELS[value]
}

export function entryKey(
  entry: Pick<UserGamePlatformEntry, 'platform' | 'console'>
) {
  return `${entry.platform}:${entry.console}`
}

export function singleConsoleFor(
  platform: LibraryPlatform,
  entries: UserGamePlatformEntry[],
  released: Set<PlatformConsole> | null = null
): PlatformConsole | null {
  const taken = entries.filter(e => e.platform === platform).map(e => e.console)
  const candidates = consoleGroupsFor(platform, released)
    .flatMap(group => group.consoles)
    .filter(c => !taken.includes(c))
  return candidates.length === 1 ? candidates[0] : null
}

// Sobra console para escolher? Linha UNKNOWN nunca convive com consoles conhecidos
// (o back a completa ao adicionar um), então basta olhar os consoles ainda sem linha.
export function hasFreeConsole(
  platform: LibraryPlatform,
  entries: UserGamePlatformEntry[],
  released: Set<PlatformConsole> | null = null
) {
  const taken = entries.filter(e => e.platform === platform).map(e => e.console)
  return consoleGroupsFor(platform, released).some(group =>
    group.consoles.some(c => !taken.includes(c))
  )
}

const PC_STORES: LibraryPlatform[] = ['STEAM', 'EPIC']

export function entryDisplayName(
  entry: Pick<UserGamePlatformEntry, 'platform' | 'console'>,
  platformLabel: string
) {
  if (entry.console === 'UNKNOWN') return platformLabel
  // "Steam · PC" é redundante: PC nas lojas de PC mostra só o nome da loja.
  if (entry.console === 'PC' && PC_STORES.includes(entry.platform)) {
    return platformLabel
  }
  // Game Pass no PC: "PC" sozinho, com o ícone do Xbox, não diz de onde vem.
  if (entry.console === 'PC' && entry.platform === 'XBOX') {
    return `${platformLabel} (PC)`
  }
  return consoleLabel(entry.console)
}

export function entryHint(
  entry: UserGamePlatformEntry,
  entries: UserGamePlatformEntry[]
) {
  if (entry.console !== 'UNKNOWN') return null
  const siblings = entries.filter(e => e.platform === entry.platform)
  return siblings.length > 1 ? consoleLabel('UNKNOWN') : null
}
