import type { IconType } from 'react-icons'
import { FaGamepad } from 'react-icons/fa'
import {
  SiEpicgames,
  SiNintendoswitch,
  SiPlaystation,
  SiSteam,
  SiXbox,
} from 'react-icons/si'
import type { LibraryPlatform } from '../types/platform'

export interface LibraryPlatformOption {
  value: LibraryPlatform
  label: string
  icon: IconType
}

export const LIBRARY_PLATFORMS: LibraryPlatformOption[] = [
  { value: 'STEAM', label: 'Steam', icon: SiSteam },
  { value: 'PLAYSTATION', label: 'PlayStation', icon: SiPlaystation },
  { value: 'XBOX', label: 'Xbox', icon: SiXbox },
  { value: 'NINTENDO', label: 'Nintendo', icon: SiNintendoswitch },
  { value: 'EPIC', label: 'Epic', icon: SiEpicgames },
  { value: 'OTHER', label: 'Outro', icon: FaGamepad },
]

const BY_VALUE = new Map(LIBRARY_PLATFORMS.map(p => [p.value, p]))

export function getLibraryPlatform(value: string) {
  return BY_VALUE.get(value as LibraryPlatform)
}

function libraryPlatformsFor(gamePlatformName: string): LibraryPlatform[] {
  const n = gamePlatformName.toLowerCase()
  const found: LibraryPlatform[] = []

  if (n.includes('playstation')) found.push('PLAYSTATION')
  if (n.includes('xbox')) found.push('XBOX')
  if (
    n.includes('nintendo') ||
    n.includes('wii') ||
    n.includes('switch') ||
    n.includes('game boy')
  ) {
    found.push('NINTENDO')
  }
  if (n.includes('windows') || n.includes('mac') || n.includes('linux')) {
    found.push('STEAM')
  }
  if (n.includes('windows') || n.includes('mac')) found.push('EPIC')
  if (n.includes('steam')) found.push('STEAM')

  return found
}

export function getAvailableLibraryPlatforms(
  gamePlatforms: string[] | undefined,
  registered: LibraryPlatform[] = []
) {
  if (!gamePlatforms || gamePlatforms.length === 0) return LIBRARY_PLATFORMS

  const available = new Set<LibraryPlatform>(['OTHER', ...registered])
  for (const name of gamePlatforms) {
    for (const platform of libraryPlatformsFor(name)) available.add(platform)
  }

  return LIBRARY_PLATFORMS.filter(p => available.has(p.value))
}
