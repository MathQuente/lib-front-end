import { Gamepad2, Monitor } from 'lucide-react'
import { FaXbox } from 'react-icons/fa'
import {
  SiNintendo,
  SiNintendo3Ds,
  SiNintendogamecube,
  SiNintendoswitch,
  SiPlaystation,
  SiPlaystation2,
  SiPlaystation3,
  SiPlaystation4,
  SiPlaystation5,
  SiPlaystationvita
} from 'react-icons/si'
import type { IconType } from 'react-icons'

export function getPlatformIcon(name: string): IconType {
  const n = name.toLowerCase()

  if (n.includes('playstation')) {
    if (n.includes('vita')) return SiPlaystationvita
    if (n.includes('5')) return SiPlaystation5
    if (n.includes('4')) return SiPlaystation4
    if (n.includes('3')) return SiPlaystation3
    if (n.includes('2')) return SiPlaystation2
    return SiPlaystation
  }

  if (n.includes('xbox')) return FaXbox

  if (n.includes('nintendo') || n === 'wii' || n === 'wii u') {
    if (n.includes('3ds')) return SiNintendo3Ds
    if (n.includes('gamecube')) return SiNintendogamecube
    if (n.includes('switch')) return SiNintendoswitch
    return SiNintendo
  }

  if (
    n.includes('pc') ||
    n.includes('windows') ||
    n.includes('mac') ||
    n.includes('linux')
  ) {
    return Monitor
  }

  return Gamepad2
}
