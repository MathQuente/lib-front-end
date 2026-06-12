export function UserBanner({ bannerUrl }: { bannerUrl?: string }) {
  return (
    <div className="w-full h-28 md:h-36 rounded-t-lg overflow-hidden">
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt="Banner do usuário"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-dark-border" />
      )}
    </div>
  )
}
