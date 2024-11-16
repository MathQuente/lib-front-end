interface PlaformDivProps {
  platformName: string
}

export function PlatformDiv({ platformName }: PlaformDivProps) {
  return (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg px-4 py-2 flex flex-row items-center justify-center">
      <p className="text-slate-400 text-xl font-normal">{platformName}</p>
    </div>
  )
}
