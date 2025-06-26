export function UserBanner({ bannerUrl }: { bannerUrl?: string }) {
  if (bannerUrl) {
    return (
      <img
        src={bannerUrl}
        alt="Banner do usuário"
        className="w-full h-[90px] sm:h-[100px] md:h-[120px] lg:h-[150px] object-cover rounded-t"
      />
    )
  }

  return (
    <div
      className="flex items-center justify-center w-full h-[90px] sm:h-[100px] md:h-[120px] lg:h-[150px] bg-gray-700 rounded-t"
      aria-label="Banner padrão"
    >
      <span className="text-gray-400 text-sm">Sem banner</span>
    </div>
  )
}
