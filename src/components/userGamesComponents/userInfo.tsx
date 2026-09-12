export function UserInfo({
  userName,
  gamesAmount,
  totalHoursPlayed
}: {
  userName: string
  gamesAmount: number
  totalHoursPlayed: number
}) {
  return (
    <div>
      <p className="text-white font-semibold">{userName}</p>
      <p className="text-gray-400 text-sm">
        {gamesAmount.toLocaleString()} {gamesAmount === 1 ? 'jogo' : 'jogos'}
        {totalHoursPlayed > 0 &&
          ` · ${Number(totalHoursPlayed.toFixed(1)).toLocaleString()}h jogadas`}
      </p>
    </div>
  )
}
