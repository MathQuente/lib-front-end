export function UserInfo({
  userName,
  gamesAmount,
}: {
  userName: string
  gamesAmount: number
}) {
  return (
    <div className="flex justify-start w-full ml-4 gap-2 items-center">
      <p
        className="text-white font-semibold truncate max-w-[150px]"
        title={userName}
      >
        {userName}
      </p>
      <span className="text-zinc-400">|</span>
      <p className="text-white font-semibold">
        Games: {gamesAmount.toLocaleString()}
      </p>
    </div>
  )
}
