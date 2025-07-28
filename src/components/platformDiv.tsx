import { Gamepad2, Monitor } from 'lucide-react'

interface PlaformDivProps {
  platformName: string
}

export function PlatformDiv({ platformName }: PlaformDivProps) {
  const getPlatformIcon = (platformName: string) => {
    const name = platformName.toLowerCase()

    if (
      name.includes('pc') ||
      name.includes('windows') ||
      name.includes('steam') ||
      name.includes('epic')
    ) {
      return Monitor
    }
    if (
      name.includes('xbox') ||
      name.includes('playstation') ||
      name.includes('ps') ||
      name.includes('nintendo') ||
      name.includes('switch')
    ) {
      return Gamepad2
    }

    return Monitor
  }

  const PlatformIcon = getPlatformIcon(platformName)

  return (
    <div className="px-3 py-1 bg-gray-700/50 rounded-full text-sm inline-flex items-center justify-center gap-1">
      <PlatformIcon className="text-gray-300 w-5 h-5 font-normal" />
      <p className="text-gray-300 md:text-sm lg:text-base font-normal">
        {platformName}
      </p>
    </div>
  )
}
