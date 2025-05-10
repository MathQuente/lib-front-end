interface PlaformDivProps {
  platformName: string
}

export function PlatformDiv({ platformName }: PlaformDivProps) {
  return (
    <div
      className="bg-gray-800 border-2 border-gray-600 rounded-lg px-2 
      md:px-4 lg:py-2 flex flex-row items-center justify-center"
    >
      <p className="text-slate-400 md:text-lg lg:text-2xl font-normal">
        {platformName}
      </p>
    </div>
  )
}
