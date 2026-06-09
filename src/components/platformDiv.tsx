import { Gamepad2, Monitor } from 'lucide-react'

interface PlatformDivProps {
  platformName: string
}

function getPlatformIcon(name: string) {
  const n = name.toLowerCase()
  if (
    n.includes('xbox') ||
    n.includes('playstation') ||
    n.includes('ps') ||
    n.includes('nintendo') ||
    n.includes('switch')
  ) {
    return Gamepad2
  }
  return Monitor
}

export function PlatformDiv({ platformName }: PlatformDivProps) {
  const Icon = getPlatformIcon(platformName)

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#25262F] border border-[#2A2B36] rounded-full text-sm">
      <Icon className="size-4 text-gray-500 flex-shrink-0" />
      <span className="text-gray-300">{platformName}</span>
    </div>
  )
}
